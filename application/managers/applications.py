"""
Applications management.
"""
import asyncio
import logging
from datetime import datetime
from datetime import timedelta
from uuid import uuid4

from fastapi import Depends
from fastapi import status

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from constants.events import EventCategory
from constants.events import EventSeverityLevel
from constants.helm import ReleaseHealthStatuses
from constants.kubernetes import K8sKinds
from constants.templates import HookOnFailureBehavior
from core.configuration import settings
from crud.applications import ApplicationDatabase
from crud.applications import get_application_db
from exceptions.application import ApplicationComponentInstallException
from exceptions.application import ApplicationComponentUninstallException
from exceptions.application import ApplicationComponentUpdateException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from exceptions.application import ApplicationLaunchTimeoutException
from exceptions.common import CommonException
from exceptions.helm import HelmException
from exceptions.helm import ReleaseNotFoundException
from exceptions.templates import InvalidUserInputsException
from managers.events import EventManager
from managers.events import get_event_manager
from managers.helm.manager import HelmManager
from managers.helm.manager import get_helm_manager
from managers.kubernetes import K8sManager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from models.application import Application
from models.organization import Organization
from models.template import TemplateRevision
from models.user import User
from schemas.events import EventSchema
from schemas.templates import TemplateSchema
from schemas.templates.components import Component
from schemas.templates.hooks import Hook
from utils.template import load_template
from utils.template import render_template
from utils.template import validate_inputs


logger = logging.getLogger(__name__)


class ApplicationManager:
    """
    Deployed application business logic.
    """
    db: ApplicationDatabase
    organization_manager: OrganizationManager
    helm_manager: HelmManager
    event_manager: EventManager

    def __init__(self, db: ApplicationDatabase, organization_manager: OrganizationManager, event_manager: EventManager,
                 helm_manager: HelmManager) -> None:
        self.db = db
        self.organization_manager = organization_manager
        self.helm_manager = helm_manager
        self.event_manager = event_manager

    async def install(self, context_name: str, namespace: str, user: User, template: TemplateRevision, inputs: dict,
                      dry_run: bool = False) -> Application | dict[str, dict]:
        """
        Installs application from provided manifest.
        """
        validate_inputs(template.template, inputs)
        raw_manifest = self.render_manifest(template, user_inputs=inputs)
        manifest = load_template(raw_manifest)

        if dry_run:
            components = [component for component in manifest.components if component.enabled]
            outputs = await asyncio.gather(*[
                self.install_component(
                    component,
                    organization=user.organization,
                    context_name=context_name,
                    namespace=namespace,
                    dry_run=dry_run
                )
                for component in components
            ])

            return {component.name: output for component, output in zip(components, outputs)}
        else:
            application = {
                'name': manifest.name,
                'description': '',
                'manifest': raw_manifest,
                'status': ApplicationStatuses.deploy_requested,
                'health': ApplicationHealthStatuses.unhealthy,
                'context_name': context_name,
                'namespace': namespace,
                'user_inputs': inputs,
                'template_id': template.id,
                'creator_id': str(user.id),
                'organization_id': user.organization.id
            }
            application_record = await self.db.create(application)

            from services.procrastinate.tasks.application import execute_pre_install_hooks
            await execute_pre_install_hooks.defer_async(application_id=application_record.id)
            await self.event_manager.create(EventSchema(
                title='Application deploy requested.',
                message='Created deferred task to deploy application.',
                category=EventCategory.application,
                organization_id=user.organization.id,
                data={'application_id': application_record.id}
            ))

            return application_record

    async def upgrade(self, application: Application, template: TemplateRevision,
                      dry_run: bool = False) -> dict[str, dict]:
        """
        Upgrades application with new template.
        """
        if dry_run:
            return await self.upgrade_components(application, template, dry_run=dry_run)
        else:
            from services.procrastinate.tasks.application import execute_pre_upgrade_hooks
            await execute_pre_upgrade_hooks.defer_async(application_id=application.id, new_template_id=template.id)
            await self.event_manager.create(EventSchema(
                title='Application upgrade requested.',
                message='Created deferred task to upgrade application with new template.',
                category=EventCategory.application,
                organization_id=application.organization.id,
                data={
                    'application_id': application.id,
                    'template_id': template.id
                }
            ))

    async def upgrade_components(self, application: Application, new_template: TemplateRevision,
                                 dry_run: bool = False) -> dict[str, dict]:
        """
        Upgrades application components. Determines what components are need to
        install update delete and does it.
        """
        new_manifest = load_template(self.render_manifest(new_template, application=application))
        old_manifest: TemplateSchema = load_template(application.manifest)

        new_components_names = new_manifest.components_mapping.keys()
        old_components_names = old_manifest.components_mapping.keys()
        components_to_install = [
            new_manifest.components_mapping[component_name]
            for component_name in new_components_names - old_components_names
            if new_manifest.components_mapping[component_name].enabled
        ]
        components_to_remove = [
            old_manifest.components_mapping[component_name]
            for component_name in old_components_names - new_components_names
            if old_manifest.components_mapping[component_name].enabled
        ]
        components_to_update = [
            new_manifest.components_mapping[component_name]
            for component_name in old_components_names & new_components_names
            if new_manifest.components_mapping[component_name].enabled
        ]
        results = {
            'install_outputs': {},
            'update_outputs': {},
            'uninstall_outputs': {},
        }

        for component in components_to_install:
            output = await self.install_component(component, application, dry_run=dry_run)
            results['install_outputs'][component.name] = output
        for component in components_to_update:
            output = await self.update_component(application, component, dry_run=dry_run)
            results['update_outputs'][component.name] = output
        for component in components_to_remove:
            output = await self.uninstall_component(application, component, dry_run=dry_run)
            results['uninstall_outputs'][component.name] = output

        return results

    async def update_user_inputs(self, application: Application, inputs: dict, dry_run: bool = False) -> dict:
        """
        Updates user inputs.

        Renders application's template with new user inputs and updates all releases.
        """
        old_template_schema = load_template(application.manifest)
        # User inputs validation.
        validate_inputs(application.manifest, inputs)
        if inputs.keys() != application.user_inputs.keys():
            raise InvalidUserInputsException('List of current and new inputs are not equal.')
        immutable_inputs = [name for name, input in old_template_schema.inputs_mapping.items() if input.immutable]
        violating_inputs = []
        for input_name in immutable_inputs:
            if inputs[input_name] != application.user_inputs[input_name]:
                violating_inputs.append(input_name)
        if violating_inputs:
            raise InvalidUserInputsException(
                f'Next inputs are immutable and cannot be changed: {", ".join(violating_inputs)}.'
            )

        new_manifes = render_template(application.template.template, inputs)
        new_template_schema = load_template(new_manifes)

        # Ensuring that charts critical parts of chart specification wasn't changed.
        old_components_names = old_template_schema.components_mapping.keys()
        new_components_names = new_template_schema.components_mapping.keys()
        absent_release_names = old_components_names - new_components_names
        if absent_release_names:
            CommonException(
                f'Failed to update user inputs. Unable to find charts with release names '
                f'{", ".join(absent_release_names)} in manifest rendered with new user inputs.',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        update_results = {}
        for release_name, chart in new_template_schema.components_mapping.items():
            update_results[release_name] = await self.helm_manager.update_release(
                organization=application.organization,
                context_name=application.context_name,
                namespace=application.namespace,
                release_name=release_name,
                chart_name=chart.chart,
                values=chart.values,
                dry_run=dry_run
            )

        if not dry_run:
            application.manifest = new_manifes
            await self.db.save(application)

        return update_results

    async def terminate(self, application: Application) -> None:
        """
        Starts application termination flow.
        """
        await self.set_state_status(application, ApplicationStatuses.termination_requested)

        from services.procrastinate.tasks.application import execute_pre_terminate_hooks
        await execute_pre_terminate_hooks.defer_async(application_id=application.id)
        await self.event_manager.create(EventSchema(
            title='Application termination requested.',
            message='Created deferred task to terminate application.',
            category=EventCategory.application,
            organization_id=application.organization.id,
            data={'application_id': application.id}
        ))

    async def get_application_health_condition(self, application: Application) -> dict:
        """
        Returns application status.
        """
        template_schema = load_template(application.manifest)
        problem_components = {}
        for component in template_schema.components:
            try:
                component_health_status = await self.helm_manager.release_health_status(
                    application.organization,
                    application.context_name,
                    application.namespace,
                    component.name
                )
            except ReleaseNotFoundException:
                problem_components[component] = None
                continue
            if component_health_status['status'] != ReleaseHealthStatuses.healthy:
                problem_components[component] = component_health_status['details']
        if problem_components:
            return {
                'status': ApplicationHealthStatuses.unhealthy,
                'problem_components': problem_components
            }
        else:
            return {
                'status': ApplicationHealthStatuses.healthy,
                'problem_components': {}
            }

    async def await_healthy_state(self, application: Application) -> None:
        """
        Awaits until application become healthy or rises timeout exception.
        """
        application_deadline = datetime.now() + timedelta(seconds=settings.APPLICATION_COMPONENTS_INSTALL_TIMEOUT)
        while datetime.now() < application_deadline:
            condition = await self.get_application_health_condition(application)
            if condition['status'] == ApplicationHealthStatuses.healthy:
                return
        else:
            await self.event_manager.create(EventSchema(
                title='Application failed to start.',
                message='Not all application components became healthy in time.',
                category=EventCategory.application,
                organization_id=application.organization.id,
                severity=EventSeverityLevel.error,
                data={
                    'application_id': application.id,
                    'problem_components': {
                        component.name: details for component, details in condition['problem_components'].items()
                    }
                }
            ))
            raise ApplicationLaunchTimeoutException(f'Failed to start application in time.', application=application)

    async def install_component(self, component: Component, application: Application | None = None,
                                organization: Organization | None = None, context_name: str | None = None,
                                namespace: str | None = None, dry_run: bool = False) -> str:
        """
        Installs application component.
        """
        if application is not None:
            organization = application.organization
            context_name = application.context_name
            namespace = application.namespace
        if not all([organization is not None, context_name, namespace]):
            raise ValueError(
                'Application instance or organization and context_name and namespace must be provided to install '
                'application component.'
            )
        try:
            return await self.helm_manager.install_chart(
                organization=organization,
                context_name=context_name,
                namespace=namespace,
                release_name=component.name,
                chart_name=component.chart,
                version=component.version,
                values=component.values,
                dry_run=dry_run
            )
        except HelmException as error:
            logger.error(f'Failed to install application component. {error.message}')
            raise ApplicationComponentInstallException(
                f'Failed to install application component.',
                application=application, component=component
            )

    async def update_component(self, application: Application, component: Component, dry_run: bool = False) -> str:
        """
        Updates application component.
        """
        try:
            return await self.helm_manager.update_release(
                organization=application.organization,
                context_name=application.context_name,
                namespace=application.namespace,
                release_name=component.name,
                chart=component.chart,
                values=component.values,
                dry_run=dry_run
            )
        except HelmException as error:
            logger.error(f'Failed to update application component. {error.message}')
            raise ApplicationComponentUpdateException(
                f'Failed to update application component.',
                application=application, component=component
            )

    async def uninstall_component(self, application: Application, component: Component, dry_run: bool = False) -> str:
        """
        Uninstalls application component.
        """
        try:
            await self.helm_manager.uninstall_release(
                organization=application.organization,
                context_name=application.context_name,
                namespace=application.namespace,
                release_name=component.name,
                dry_run=dry_run
            )
        except ReleaseNotFoundException:
            logging.warning(f'Failed to uninstall component "{component.name}". No corresponding Helm release found.')
        except HelmException as error:
            logging.exception(f'Failed to uninstall component "{component.name}". {error.message}')
            raise ApplicationComponentUninstallException(
                f'Failed to uninstall component "{component.name}".',
                application=application, component=component
            )

    async def execute_hook(self, application: Application, hook: Hook) -> None:
        """
        Executes application hook.
        """
        context_name = hook.kube_context or application.context_name
        namespace = hook.namespace or application.namespace
        job_name = f'{hook.name}-{uuid4().hex}'
        with self.organization_manager.get_kubernetes_configuration(application.organization) as k8s_config_path:
            k8s_manager = K8sManager(k8s_config_path)
            await k8s_manager.create_namespace(context_name, namespace, exists_ok=True)
            await k8s_manager.run_command(
                context_name=context_name,
                namespace=namespace,
                job_name=job_name,
                image=hook.image,
                command=hook.command,
                args=hook.args,
                env=hook.env,
                service_account_name=hook.service_account_name
            )
            job_deadline = datetime.now() + timedelta(seconds=hook.timeout)
            while datetime.now() < job_deadline:
                job = await k8s_manager.get_details(
                    context_name=context_name,
                    namespace=namespace,
                    kind=K8sKinds.job,
                    name=job_name
                )
                if job.is_completed:
                    await self.event_manager.create(EventSchema(
                        title='Application deploy.',
                        message=f'Hook "{hook.name}" successfully executed.',
                        organization_id=application.organization.id,
                        category=EventCategory.application,
                        data={
                            'application_id': application.id,
                            'hook': hook.name
                        }
                    ))
                    break
                if job.is_failed:
                    job_log = k8s_manager.get_log(
                        context_name=context_name, namespace=namespace, kind=K8sKinds.job, entity_name=job_name
                    )
                    logger.error(f'Failed to launch hook "{hook.name}". Error message from Job:\n{job_log}')
                    if hook.on_failure == HookOnFailureBehavior.stop:
                        await self.event_manager.create(EventSchema(
                            title='Application deploy failed.',
                            message=f'Failed to start application because was error during execution of "{hook.name}" '
                                    f'hook and this hook is vital for application deployment.',
                            organization_id=application.organization.id,
                            category=EventCategory.application,
                            severity=EventSeverityLevel.error,
                            data={
                                'application_id': application.id,
                                'hook': hook.name,
                                'job_log': job_log
                            }
                        ))
                        raise ApplicationHookLaunchException(
                            f'<Hook name="{hook.name}"> failed to execute.',
                            application=application,
                            hook=hook,
                            log=job_log
                        )
            else:
                logger.error(f'Hook "{hook.name}" launch timeout. Failed to launch hook in {hook.timeout} seconds.')
                await self.event_manager.create(EventSchema(
                    title='Application deploy failed.',
                    message=f'Failed to start application because execution of hook "{hook.name}" was not finished in '
                            f'time and this hook is vital for application deployment.',
                    organization_id=application.organization.id,
                    category=EventCategory.application,
                    severity=EventSeverityLevel.error,
                    data={
                        'application_id': application.id,
                        'hook': hook.name
                    }
                ))
                raise ApplicationHookTimeoutException(
                    f'<Hook name="{hook.name}"> failed to execute in {hook.timeout} seconds.',
                    application=application,
                    hook=hook
                )

    async def set_ttl(self, application: Application, delta: timedelta) -> None:
        """
        Set deadline after which application must be terminated.
        """
        if delta.total_seconds() < 0:
            raise ValueError('Unable to set application TTL. Time offset can not be in past.')

        if delta.total_seconds() == 0:
            if application.ttl is not None:
                application.ttl = None
                await self.db.save(application)
        else:
            now = datetime.now()
            application.ttl = now + delta
            await self.db.save(application)

    def get_inputs(self, template: TemplateRevision, *, application: Application | None = None,
                   user_inputs: dict | None = None) -> dict:
        """
        Returns user inputs extended with defaults from template if need.
        """
        if user_inputs is None:
            user_inputs = {}
            if application is not None:
                user_inputs = application.user_inputs

        template_schema = load_template(template.template)
        input_defaults = template_schema.inputs_defaults
        user_inputs = {**input_defaults, **user_inputs}

        return user_inputs

    def render_manifest(self, template: TemplateRevision, *, application: Application | None = None,
                        user_inputs: dict | None = None) -> str:
        """
        Renders new application's manifest using existing user input.
        """
        inputs = self.get_inputs(template, application=application, user_inputs=user_inputs)

        manifest = render_template(template.template, inputs)

        return manifest

    async def get_organization_application(self, application_id: int, organization: Organization) -> Application:
        """
        Returns organization's application record.
        """
        return await self.db.get(id=application_id, organization_id=organization.id)

    async def get_application(self, application_id: int) -> Application:
        """
        Returns application record.
        """
        return await self.db.get(id=application_id)

    async def list_applications(self, organization: Organization) -> list[Application]:
        """
        Returns list of organization's application records.
        """
        return await self.db.list(organization_id=organization.id)

    async def list_all_applications(self) -> list[Application]:
        """
        Returns list of all application records.
        """
        return await self.db.list()

    async def set_state_status(self, application: Application, status: ApplicationStatuses) -> None:
        """
        Sets application state status.
        """
        if status not in ApplicationStatuses:
            raise ValueError(f'Unknown application state status "{status}".')

        if application.status != status:
            await self.event_manager.create(EventSchema(
                title='Application operational status.',
                message=f'Application operational status changed from "{application.status}" to "{status}".',
                organization_id=application.organization.id,
                category=EventCategory.application,
                data={'application_id': application.id}
            ))
            application.status = status
            await self.db.save(application)

    async def set_health_status(self, application: Application, status: ApplicationHealthStatuses) -> None:
        """
        Sets application health status.
        """
        if status not in ApplicationHealthStatuses:
            raise ValueError(f'Unknown application health status "{status}".')

        if application.health != status:
            await self.event_manager.create(EventSchema(
                title='Application health changed.',
                message=f'Application health condition changed from "{application.health}" to "{status}".',
                organization_id=application.organization.id,
                category=EventCategory.application,
                data={'application_id': application.id}
            ))
            application.health = status
            await self.db.save(application)

    async def delete_application(self, application_id: int):
        """
        Deletes application record from DB.
        """
        await self.db.delete(id=application_id)


async def get_application_manager(
    db=Depends(get_application_db),
    organization_manager=Depends(get_organization_manager),
    event_manager=Depends(get_event_manager),
    helm_manager=Depends(get_helm_manager)
):
    yield ApplicationManager(db, organization_manager, event_manager, helm_manager)
