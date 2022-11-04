import asyncio
import logging

from constants.applications import ApplicationStatuses
from core.configuration import settings
from db.session import session_maker
from exceptions.application import ApplicationComponentInstallException
from exceptions.application import ApplicationComponentUninstallException
from exceptions.application import ApplicationComponentUpdateException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from exceptions.application import ApplicationLaunchTimeoutException
from models.application import Application
from models.template import TemplateRevision
from schemas.templates import TemplateSchema
from services.procrastinate.application import procrastinate
from utils.template import load_template
from utils.template import render_template

from .utils import get_application_manager
from .utils import get_template_manager


logger = logging.getLogger(__name__)


@procrastinate.task(name='application__run_pre_upgrade_hooks')
async def execute_pre_upgrade_hooks(application_id: int, new_template_id: int):
    """
    Executes application pre-upgrade hooks. Then runs task to install, update,
    remove application's components.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        template_manager = get_template_manager(session)
        application = await application_manager.get_application(application_id)
        new_template = await template_manager.get_organization_template(new_template_id, application.organization)
        manifest = load_template(application_manager.render_manifest(new_template, application=application))
        await application_manager.set_state_status(application, ApplicationStatuses.upgrading)
        try:
            await asyncio.gather(*[
                application_manager.execute_hook(application, hook)
                for hook in manifest.hooks.pre_upgrade if hook.enabled
            ])
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to upgrade <Applicaton ID="{application.id}">. '
                f'Failed to execute pre-upgrade <Hook name="{error.hook.name}">.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            return

    await upgrade_applicatoin_components.defer_async(application_id=application_id, new_template_id=new_template_id)


@procrastinate.task(name='application__upgrade_components')
async def upgrade_applicatoin_components(application_id: int, new_template_id: int):
    """
    Installs application components. When application's components become
    operational runs post-install hooks.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        template_manager = get_template_manager(session)
        application = await application_manager.get_application(application_id)
        new_template = await template_manager.get_organization_template(new_template_id, application.organization)
        try:
            await application_manager.upgrade_components(application, new_template)
        except (ApplicationComponentInstallException,
                ApplicationComponentUpdateException,
                ApplicationComponentUninstallException):
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            raise
        try:
            await application_manager.await_healthy_state(application)
        except ApplicationLaunchTimeoutException:
            logger.error(
                f'Failed to upgrate <Applicaton ID="{application.id}">. Reached deadline of awaiting application to '
                f'become healthy.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            raise

    await execute_post_upgrade_hooks.defer_async(application_id=application_id, new_template_id=new_template_id)


@procrastinate.task(name='application__run_post_upgrade_hooks')
async def execute_post_upgrade_hooks(application_id: int, new_template_id: int):
    """
    Executes application post-upgrade hooks.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        template_manager = get_template_manager(session)
        application = await application_manager.get_application(application_id)
        new_template = await template_manager.get_organization_template(new_template_id, application.organization)
        raw_manifest = application_manager.render_manifest(new_template, application=application)
        manifest = load_template(raw_manifest)
        try:
            await asyncio.gather(*[
                application_manager.execute_hook(application, hook)
                for hook in manifest.hooks.post_upgrade if hook.enabled
            ])
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}">. '
                f'Failed to execute post-upgrade <Hook name="{error.hook.name}">.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            return
        await application_manager.set_state_status(application, ApplicationStatuses.deployed)
        application.manifest = raw_manifest
        application.template = new_template
        application.user_inputs = application_manager.get_inputs(new_template, application=application)
        await application_manager.db.save(application)
