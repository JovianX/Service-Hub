import asyncio
import logging
from pprint import pprint

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from constants.events import EventCategory
from db.session import session_maker
from exceptions.application import ApplicationComponentInstallException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from exceptions.application import ApplicationLaunchTimeoutException
from schemas.events import EventSchema
from schemas.templates import TemplateSchema
from services.procrastinate.application import procrastinate
from utils.template import load_template
from utils.template import render_template

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
        manifest: TemplateSchema = load_template(application.manifest)
        components = [component for component in manifest.components if component.enabled]
        try:
            for component in components:
                await application_manager.install_component(component, application)
        except ApplicationComponentInstallException:
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            for component in components:
                await application_manager.uninstall_component(application, component)
            raise
        try:
            await application_manager.await_healthy_state(application)
            await application_manager.set_health_status(application, ApplicationHealthStatuses.healthy)
            components_manifests = await application_manager.get_component_manifests(application)
            manifest = render_template(application.template.template, application.user_inputs, components_manifests)
            application.manifest = manifest
            await application_manager.db.save(application)
        except ApplicationLaunchTimeoutException:
            logger.error(
                f'Failed to install <Applicaton ID="{application.id}">. Reached deadline of awaiting application to '
                f'become healthy.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            raise

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
            title='Application deployed.',
            message=f'Application was successfully deployed.',
            organization_id=application.organization.id,
            category=EventCategory.application,
            data={'application_id': application.id}
        ))
        await application_manager.set_state_status(application, ApplicationStatuses.deployed)
