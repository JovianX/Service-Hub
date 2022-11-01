import asyncio
import logging
from datetime import datetime
from datetime import timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from core.configuration import settings
from crud.applications import ApplicationDatabase
from crud.organizations import OrganizationDatabase
from db.session import session_maker
from exceptions.application import ApplicationComponentInstallException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from exceptions.application import ApplicationLaunchTimeoutException
from managers.applications import ApplicationManager
from managers.organizations.manager import OrganizationManager
from schemas.templates import TemplateSchema
from utils.template import load_template

from ..application import procrastinate


logger = logging.getLogger(__name__)


@procrastinate.periodic(cron='*/1 * * * *')
@procrastinate.task(name='application__check_health')
async def check_applications_health(*args, **kwargs):
    """
    Checks applications health status.
    """
    async with session_maker() as session:
        application_manager = _get_application_manager(session)
        applications = await application_manager.list_all_applications()
        for application in applications:
            status = await application_manager.get_application_health_status(application)
            if application.health != status:
                application.health = status
                await application_manager.db.save(application)


################################################################################
# Application install flow.
################################################################################
@procrastinate.task(name='application__run_pre_install_hooks')
async def execute_pre_install_hooks(application_id: int, dry_run: bool = False):
    """
    Executes application pre-install hooks. Then runs application components
    install task.
    """
    async with session_maker() as session:
        application_manager = _get_application_manager(session)
        application = await application_manager.get_application(application_id)
        application.status = ApplicationStatuses.deploying
        await application_manager.db.save(application)
        manifest: TemplateSchema = load_template(application.manifest)
        try:
            await asyncio.gather(*[
                application_manager.execute_hook(application, hook)
                for hook in manifest.hooks.pre_install if hook.enabled
            ])
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}">. '
                f'Failed to launch pre-install <Hook name="{error.hook.name}">.'
            )
            application.status = ApplicationStatuses.error
            await application_manager.db.save(application)
            return

    await install_applicatoin_components.defer_async(application_id=application_id, dry_run=dry_run)


@procrastinate.task(name='application__install_components')
async def install_applicatoin_components(application_id: int, dry_run: bool = False):
    """
    Installs application components. When application's components become
    operational runs post-install hooks.
    """
    async with session_maker() as session:
        application_manager = _get_application_manager(session)
        application = await application_manager.get_application(application_id)
        manifest: TemplateSchema = load_template(application.manifest)
        try:
            await asyncio.gather(*[
                application_manager.install_component(application, component, dry_run=dry_run)
                for component in manifest.components if component.enabled
            ])
        except ApplicationComponentInstallException:
            application.status = ApplicationStatuses.error
            await application_manager.db.save(application)
            await asyncio.gather(*[
                application_manager.uninstall_component(application, component)
                for component in manifest.components if component.enabled
            ])
            raise
        application_deadline = datetime.now() + timedelta(seconds=settings.APPLICATION_COMPONENTS_INSTALL_TIMEOUT)
        while datetime.now() < application_deadline:
            status = await application_manager.get_application_health_status(application)
            if status == ApplicationHealthStatuses.healthy:
                break
        else:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}"> in '
                f'{settings.APPLICATION_COMPONENTS_INSTALL_TIMEOUT} seconds.'
            )
            application.status = ApplicationStatuses.error
            await application_manager.db.save(application)
            raise ApplicationLaunchTimeoutException(f'Failed to start application in time.', application=application)

    await execute_post_install_hooks.defer_async(application_id=application_id)


@procrastinate.task(name='application__run_post_install_hooks')
async def execute_post_install_hooks(application_id: int):
    """
    Executes application post-install hooks.
    """
    async with session_maker() as session:
        application_manager = _get_application_manager(session)
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
                f'Failed to launch post-install <Hook name="{error.hook.name}">.'
            )
            application.status = ApplicationStatuses.error
            await application_manager.db.save(application)
            return
        application.status = ApplicationStatuses.deployed
        await application_manager.db.save(application)


def _get_application_manager(session: AsyncSession) -> ApplicationManager:
    """
    Helper to create application manager.
    """
    organization_manager = OrganizationManager(OrganizationDatabase(session))

    return ApplicationManager(ApplicationDatabase(session), organization_manager)
