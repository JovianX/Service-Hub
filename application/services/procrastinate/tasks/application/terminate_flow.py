import logging

from constants.applications import ApplicationStatuses
from constants.events import EventCategory
from db.session import session_maker
from exceptions.application import ApplicationComponentUninstallException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from schemas.events import EventSchema
from schemas.templates import TemplateSchema
from services.procrastinate.application import procrastinate
from utils.template import load_template

from .utils import get_application_manager


logger = logging.getLogger(__name__)


@procrastinate.task(name='application__run_pre_terminate_hooks')
async def execute_pre_terminate_hooks(application_id: int):
    """
    Executes application pre-terminate hooks. Then runs application components
    removal task.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        application = await application_manager.get_application(application_id)
        await application_manager.set_state_status(application, ApplicationStatuses.terminating)
        manifest: TemplateSchema = load_template(application.manifest)
        try:
            hooks = [hook for hook in manifest.hooks.pre_terminate if hook.enabled]
            for hook in hooks:
                await application_manager.execute_hook(application, hook)
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to terminate <Applicaton ID="{application.id}">. '
                f'Failed to execute pre-terminate <Hook name="{error.hook.name}">.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            return

    await remove_applicatoin_components.defer_async(application_id=application_id)


@procrastinate.task(name='application__remove_components')
async def remove_applicatoin_components(application_id: int):
    """
    Uninstalls application components. If all application components uninstalled
    successfully runs post-terminate hooks.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        application = await application_manager.get_application(application_id)
        manifest: TemplateSchema = load_template(application.manifest)
        try:
            components = [component for component in manifest.components if component.enabled]
            for component in components:
                await application_manager.uninstall_component(application, component)
        except ApplicationComponentUninstallException:
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            raise

    await execute_post_terminate_hooks.defer_async(application_id=application_id)


@procrastinate.task(name='application__run_post_terminate_hooks')
async def execute_post_terminate_hooks(application_id: int):
    """
    Executes application post-terminate hooks and deletes application.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        application = await application_manager.get_application(application_id)
        manifest: TemplateSchema = load_template(application.manifest)
        try:
            hooks = [hook for hook in manifest.hooks.post_terminate if hook.enabled]
            for hook in hooks:
                await application_manager.execute_hook(application, hook)
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}">. '
                f'Failed to launch post-install <Hook name="{error.hook.name}">.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            return

        await application_manager.event_manager.create(EventSchema(
            title='Application application terminated.',
            message=f'Application was successfully terminated.',
            organization_id=application.organization.id,
            category=EventCategory.application,
            data={'application_id': application.id}
        ))
        await application_manager.delete_application(application.id)
