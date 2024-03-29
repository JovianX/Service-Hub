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
from httpx import HTTPError

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from constants.events import EventCategory
from constants.events import EventSeverityLevel
from constants.helm import ReleaseHealthStatuses
from constants.http import HttpHealthStatuses
from constants.kubernetes import K8sKinds
from constants.templates import ComponentTypes
from constants.templates import HookOnFailureBehavior
from core.configuration import settings
from crud.applications import ApplicationDatabase
from crud.applications import get_application_db
from exceptions.application import ApplicationComponentInstallException
from exceptions.application import ApplicationComponentInstallTimeoutException
from exceptions.application import ApplicationComponentUninstallException
from exceptions.application import ApplicationComponentUpdateException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from exceptions.common import CommonException
from exceptions.helm import HelmException
from exceptions.helm import ReleaseAlreadyExistsException
from exceptions.helm import ReleaseNotFoundException
from exceptions.http import HttpException
from exceptions.templates import InvalidTemplateException
from exceptions.templates import InvalidUserInputsException
from managers.events import EventManager
from managers.events import get_event_manager
from managers.helm.manager import HelmManager
from managers.helm.manager import get_helm_manager
from managers.http.manager import HttpManager
from managers.http.manager import get_http_manager
from managers.kubernetes import K8sManager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from models.application import Application
from models.organization import Organization
from models.template import TemplateRevision
from models.user import User
from schemas.events import EventSchema
from schemas.templates import TemplateSchema
from schemas.templates.components import Components
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
    http_manager: HttpManager
    event_manager: EventManager

    def __init__(self, db: ApplicationDatabase, organization_manager: OrganizationManager, event_manager: EventManager,
                 helm_manager: HelmManager, http_manager: HttpManager) -> None:
        self.db = db
        self.organization_manager = organization_manager
        self.helm_manager = helm_manager
        self.http_manager = http_manager
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
            component_name for component_name in new_components_names - old_components_names
            if new_manifest.components_mapping[component_name].enabled
        ]
        components_to_remove = [
            component_name for component_name in old_components_names - new_components_names
            if old_manifest.components_mapping[component_name].enabled
        ]
        components_to_update = [
            component_name for component_name in old_components_names & new_components_names
            if new_manifest.components_mapping[component_name].enabled
        ]
        results = {
            'install_outputs': {},
            'update_outputs': {},
            'uninstall_outputs': {},
        }

        for component_name in new_components_names:
            component = new_manifest.components_mapping[component_name]
            if component_name in components_to_install:
                output = await self.install_component(component, application, dry_run=dry_run)
                results['install_outputs'][component.name] = output
            elif component_name in components_to_update:
                output = await self.update_component(application, component, dry_run=dry_run)
                results['update_outputs'][component.name] = output
            if not dry_run:
                await self.await_component_healthy_state(component, application)
                components_manifests = await self.get_components_manifests(application, skip_absent=True)
                raw_manifest = self.render_manifest(
                    application.template,
                    application=application,
                    components_manifests=components_manifests
                )
                new_manifest = load_template(raw_manifest)

        for component_name in components_to_remove:
            component = old_manifest.components_mapping[component_name]
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

    async def get_component_health(self, component: Components, application: Application) -> dict:
        """
        Returns component health condition.
        """
        match component.type:
            case ComponentTypes.helm_chart:
                try:
                    component_health_status = await self.helm_manager.release_health_status(
                        application.organization,
                        application.context_name,
                        application.namespace,
                        component.name
                    )
                    health_status = component_health_status['status']
                    details = component_health_status['details']
                except ReleaseNotFoundException:
                    health_status = ReleaseHealthStatuses.unhealthy
                    details = {}

            case ComponentTypes.http:
                try:
                    if component.health is None:
                        health_status = HttpHealthStatuses.healthy
                        details = "No health check provided."
                    else:
                        component_health_status = await self.http_manager.http_request(
                            component_name=component.name,
                            url=component.health.url,
                            method=component.health.method,
                            headers=component.health.headers,
                            parameters=component.health.parameters,
                            dry_run=False
                        )
                        health_status = HttpHealthStatuses.healthy
                        details = component_health_status
                except HTTPError as error:
                    health_status = HttpHealthStatuses.unhealthy
                    details = {'error': str(error)}
            case _:
                raise InvalidTemplateException(f'Unknown component type "{component.type}".')

        return {
            'status': health_status,
            'details': details
        }

    async def get_application_health_condition(self, application: Application) -> dict:
        """
        Returns application status.
        """
        template_schema = load_template(application.manifest)

        status = ApplicationHealthStatuses.healthy
        problem_components = {}
        for component in template_schema.components:
            component_health_status = await self.get_component_health(component, application)
            if component_health_status['status'] == ReleaseHealthStatuses.unhealthy:
                problem_components[component] = component_health_status['details']
                status = ApplicationHealthStatuses.unhealthy

        return {
            'status': status,
            'problem_components': problem_components
        }

    async def await_component_healthy_state(self, component: Components, application: Application) -> None:
        """
        Awaits until application component becomes healthy otherwise raises timeout exception.
        """
        application_deadline = datetime.now() + timedelta(seconds=settings.APPLICATION_COMPONENT_DEPLOY_TIMEOUT)
        while datetime.now() < application_deadline:
            condition = await self.get_component_health(component, application)
            if condition['status'] == ApplicationHealthStatuses.healthy:
                return
        else:
            raise ApplicationComponentInstallTimeoutException(
                f'Application component "{component.name}" did not become healthy in the allocated time.',
                application=application, component=component
            )

    async def install_component(self, component: Components, application: Application | None = None,
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
        match component.type:
            case ComponentTypes.helm_chart:
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
                except ReleaseAlreadyExistsException as error:
                    raise ApplicationComponentInstallException(
                        f'Failed to install application component "{component.name}". Helm release "{component.name}" already '
                        f'exists in namespace "{namespace}".', application=application, component=component)
                except HelmException as error:
                    raise ApplicationComponentInstallException(
                        f'Failed to install application component "{component.name}". {error.message}.',
                        application=application, component=component
                    )
            case ComponentTypes.http:
                try:
                    return await self.http_manager.http_request(
                        component_name=component.name,
                        url=component.create.url,
                        method=component.create.method,
                        headers=component.create.headers,
                        parameters=component.create.parameters,
                        dry_run=dry_run
                    )
                except HTTPError as error:
                    raise ApplicationComponentInstallException(
                        f'Failed to install application component "{component.name}". {error}.',
                        application=application, component=component
                    )

    async def update_component(self, application: Application, component: Components, dry_run: bool = False) -> str:
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
            raise ApplicationComponentUpdateException(
                f'Failed to update application component "{component.name}". {error.message}',
                application=application, component=component
            )

    async def uninstall_component(self, application: Application, component: Components, dry_run: bool = False) -> str:
        """
        Uninstalls application component.
        """
        match component.type:
            case ComponentTypes.helm_chart:
                try:
                    await self.helm_manager.uninstall_release(
                        organization=application.organization,
                        context_name=application.context_name,
                        namespace=application.namespace,
                        release_name=component.name,
                        dry_run=dry_run
                    )
                except ReleaseNotFoundException:
                    logging.warning(
                        f'Failed to uninstall component "{component.name}". No corresponding Helm release found.')
                except HelmException as error:
                    raise ApplicationComponentUninstallException(
                        f'Failed to uninstall component "{component.name}". {error.message}',
                        application=application, component=component
                    )
            case ComponentTypes.http:
                try:
                    await self.http_manager.http_request(
                        component_name=component.name,
                        url=component.delete.url,
                        method=component.delete.method,
                        headers=component.delete.headers,
                        parameters=component.delete.parameters,
                        dry_run=dry_run
                    )
                except HTTPError as error:
                    raise ApplicationComponentUninstallException(
                        f'Failed to uninstall application component "{component.name}". {error}.',
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
            await self.event_manager.create(EventSchema(
                title='Hook execution',
                message=f'Starting execution "{hook.name}" hook.',
                organization_id=application.organization.id,
                category=EventCategory.application,
                data={
                    'application_id': application.id,
                    'hook': hook.name
                }
            ))
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
                        title='Hook execution',
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
                            title='Hook execution',
                            message=f'Failed to execute hook "{hook.name}". Cannot continue because the hook is set '
                                    f'to stop execution on hook failure.',
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
                        await self.event_manager.create(EventSchema(
                            title='Hook execution',
                            message=f'Failed to execute hook "{hook.name}". continuing as this hook is set to '
                                    f'continue on hook failure.',
                            organization_id=application.organization.id,
                            category=EventCategory.application,
                            severity=EventSeverityLevel.warning,
                            data={
                                'application_id': application.id,
                                'hook': hook.name,
                                'job_log': job_log
                            }
                        ))
            else:
                logger.error(f'Hook "{hook.name}" launch timeout. Failed to launch hook in {hook.timeout} seconds.')
                if hook.on_failure == HookOnFailureBehavior.stop:
                    message = f'Failed to execute hook "{hook.name}" in the allocated time. Cannot continue because ' \
                              f'this hook is set to stop on failure.'
                    severity = EventSeverityLevel.error
                else:
                    message = f'Failed to execute hook "{hook.name}" in the allocated time. Skipping this hook ' \
                              f'because this hook is set to continue on failure.'
                    severity = EventSeverityLevel.warning
                await self.event_manager.create(EventSchema(
                    title='Hook execution',
                    message=message,
                    organization_id=application.organization.id,
                    category=EventCategory.application,
                    severity=severity,
                    data={
                        'application_id': application.id,
                        'hook': hook.name
                    }
                ))
                if hook.on_failure == HookOnFailureBehavior.stop:
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

    async def get_components_manifests(self, application: Application, skip_absent: bool = False) -> dict[str, list]:
        """
        Returns application components manifests.
        """
        manifests = {}
        manifest = load_template(application.manifest)
        components = [component for component in manifest.components if component.enabled]
        for component in components:
            try:
                match component.type:
                    case ComponentTypes.helm_chart:
                        manifests[component.name] = await self.helm_manager.get_detailed_manifest(
                            application.organization,
                            application.context_name,
                            application.namespace,
                            component.name
                        )
                    case ComponentTypes.http:
                        manifests[component.name] = []
                    case _:
                        raise InvalidTemplateException(f'Unknown component type "{component.type}".')

            except ReleaseNotFoundException:
                if not skip_absent:
                    raise

        return manifests

    def render_manifest(self, template: TemplateRevision, *, application: Application | None = None,
                        user_inputs: dict | None = None, components_manifests: dict[str, list] | None = None,
                        skip_context_error: bool = True) -> str:
        """
        Renders new application's manifest using existing user input.
        """
        inputs = self.get_inputs(template, application=application, user_inputs=user_inputs)

        manifest = render_template(
            template.template,
            inputs,
            components_manifests,
            skip_context_error=skip_context_error)

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

    async def list_user_applications(self, user: User) -> list[Application]:
        """
        Returns list of only user's application records.
        """
        return await self.db.list(creator_id=str(user.id))

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
    helm_manager=Depends(get_helm_manager),
    http_manager=Depends(get_http_manager)
):
    yield ApplicationManager(db, organization_manager, event_manager, helm_manager, http_manager)
