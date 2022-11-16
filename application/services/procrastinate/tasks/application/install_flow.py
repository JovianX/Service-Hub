import asyncio
import logging

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
            await asyncio.gather(*[
                application_manager.execute_hook(application, hook)
                for hook in manifest.hooks.pre_install if hook.enabled
            ])
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
        try:
            await asyncio.gather(*[
                application_manager.install_component(component, application)
                for component in manifest.components if component.enabled
            ])
        except ApplicationComponentInstallException:
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            await asyncio.gather(*[
                application_manager.uninstall_component(application, component)
                for component in manifest.components if component.enabled
            ])
            raise
        try:
            await application_manager.await_healthy_state(application)
            await application_manager.set_health_status(application, ApplicationHealthStatuses.healthy)
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
            await asyncio.gather(*[
                application_manager.execute_hook(application, hook)
                for hook in manifest.hooks.post_install if hook.enabled
            ])
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
