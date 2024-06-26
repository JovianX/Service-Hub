import logging

from fastapi import status

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from constants.events import EventCategory
from constants.events import EventSeverityLevel
from db.session import session_maker
from exceptions.application import ApplicationComponentInstallTimeoutException
from exceptions.application import ApplicationException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from exceptions.templates import TemlateVariableNotFoundException
from schemas.events import EventSchema
from schemas.templates import TemplateSchema
from services.procrastinate.application import procrastinate
from utils.template import load_template

from .utils import get_application_manager


logger = logging.getLogger(__name__)


################################################################################
# Application install flow.
################################################################################
@procrastinate.task(name='application__run_pre_install_hooks')
async def execute_pre_install_hooks(application_id: int):
    """
    Executes application pre-install hooks. Then runs application components
    install task.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        application = await application_manager.get_application(application_id)
        await application_manager.set_state_status(application, ApplicationStatuses.deploying)
        manifest: TemplateSchema = load_template(application.manifest)
        try:
            hooks = [hook for hook in manifest.hooks.pre_install if hook.enabled]
            if hooks:
                await application_manager.event_manager.create(EventSchema(
                    title='Application deployment',
                    message=f'Starting execution of pre-install hooks.',
                    organization_id=application.organization.id,
                    category=EventCategory.application,
                    data={'application_id': application.id}
                ))
            for hook in hooks:
                await application_manager.execute_hook(application, hook)
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}">. '
                f'Failed to execute pre-install <Hook name="{error.hook.name}">.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            return

    await install_applicatoin_components.defer_async(application_id=application_id)


@procrastinate.task(name='application__install_components')
async def install_applicatoin_components(application_id: int):
    """
    Installs application components. When application's components become
    operational runs post-install hooks.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        application = await application_manager.get_application(application_id)
        raw_manifest = application_manager.render_manifest(application.template, application=application)
        manifest: TemplateSchema = load_template(raw_manifest)
        components = [component for component in manifest.components if component.enabled]
        component_names = [component.name for component in components]
        try:
            for component_name in component_names:
                component = manifest.components_mapping[component_name]
                await application_manager.install_component(component, application)
                await application_manager.await_component_healthy_state(component, application)
                components_manifests = await application_manager.get_components_manifests(application, skip_absent=True)
                raw_manifest = application_manager.render_manifest(
                    application.template, application=application, components_manifests=components_manifests
                )
                manifest: TemplateSchema = load_template(raw_manifest)
                components = [component for component in manifest.components if component.enabled]
                if component_names != [component.name for component in components]:
                    logger.error(
                        f'Error during deployment of <Application ID="{application.id}"> from '
                        f'<Template ID="{application.template.id}">. Some of the application components were changed while '
                        f'rerendering the template. This probably happened because of altered '
                        f'`component.enabled` flag for one or more components after rerendering the template. ')
                    raise ApplicationException(
                        'Some application components were changed during the installation process. '
                        'This probably happened because of changed `component.enabled` flag for one or more components.',
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                        application=application)
        except ApplicationComponentInstallTimeoutException as error:
            logger.error(
                f'Failed to install <Application ID="{application.id}">. Reached timeout for awaiting for the application '
                f'component to become healthy.')
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            await application_manager.event_manager.create(EventSchema(
                title='Application deployment',
                message=f'Application deployment failed. Application component "{error.component.name}" did not become '
                        f'healthy in time.',
                organization_id=application.organization.id,
                category=EventCategory.application,
                severity=EventSeverityLevel.error,
                data={'application_id': application.id}
            ))
            raise
        except ApplicationException as error:
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            await application_manager.event_manager.create(EventSchema(
                title='Application deployment',
                message=f'Application deployment failed. {error.message.strip(".")}.',
                organization_id=application.organization.id,
                category=EventCategory.application,
                severity=EventSeverityLevel.error,
                data={'application_id': application.id}
            ))
            raw_manifest = application_manager.render_manifest(application.template, application=application)
            manifest: TemplateSchema = load_template(raw_manifest)
            components = [component for component in manifest.components if component.enabled]
            for component in components:
                await application_manager.uninstall_component(application, component)
            raise

        await application_manager.set_health_status(application, ApplicationHealthStatuses.healthy)
        components_manifests = await application_manager.get_components_manifests(application)
        try:
            raw_manifest = application_manager.render_manifest(
                application.template, application=application, components_manifests=components_manifests,
                skip_context_error=False
            )
        except TemlateVariableNotFoundException as error:
            await application_manager.event_manager.create(EventSchema(
                title='Application deployment',
                message=f'Application deployment failed. {error.message.strip(".")}.',
                organization_id=application.organization.id,
                category=EventCategory.application,
                severity=EventSeverityLevel.warning,
                data={'application_id': application.id}
            ))
            raw_manifest = application_manager.render_manifest(
                application.template, application=application, components_manifests=components_manifests
            )
        application.manifest = raw_manifest
        await application_manager.db.save(application)

    await execute_post_install_hooks.defer_async(application_id=application_id)


@procrastinate.task(name='application__run_post_install_hooks')
async def execute_post_install_hooks(application_id: int):
    """
    Executes application post-install hooks.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        application = await application_manager.get_application(application_id)
        manifest: TemplateSchema = load_template(application.manifest)
        try:
            hooks = [hook for hook in manifest.hooks.post_install if hook.enabled]
            if hooks:
                await application_manager.event_manager.create(EventSchema(
                    title='Application deployment',
                    message=f'Starting execution of post-install hooks.',
                    organization_id=application.organization.id,
                    category=EventCategory.application,
                    data={'application_id': application.id}
                ))
            for hook in hooks:
                await application_manager.execute_hook(application, hook)
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}">. '
                f'Failed to execute post-install <Hook name="{error.hook.name}">.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            return

        await application_manager.event_manager.create(EventSchema(
            title='Application deployment',
            message=f'Application was successfully deployed.',
            organization_id=application.organization.id,
            category=EventCategory.application,
            data={'application_id': application.id}
        ))
        await application_manager.set_state_status(application, ApplicationStatuses.deployed)
