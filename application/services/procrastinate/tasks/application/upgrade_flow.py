import logging

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from constants.events import EventCategory
from constants.events import EventSeverityLevel
from db.session import session_maker
from exceptions.application import ApplicationComponentInstallException
from exceptions.application import ApplicationComponentInstallTimeoutException
from exceptions.application import ApplicationComponentUninstallException
from exceptions.application import ApplicationComponentUpdateException
from exceptions.application import ApplicationHookLaunchException
from exceptions.application import ApplicationHookTimeoutException
from schemas.events import EventSchema
from services.procrastinate.application import procrastinate
from utils.template import load_template

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
            hooks = [hook for hook in manifest.hooks.pre_upgrade if hook.enabled]
            if hooks:
                await application_manager.event_manager.create(EventSchema(
                    title='Application upgrade',
                    message=f'Starting execution of pre-upgrade hooks.',
                    organization_id=application.organization.id,
                    category=EventCategory.application,
                    data={'application_id': application.id}
                ))
            for hook in hooks:
                await application_manager.execute_hook(application, hook)
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
                ApplicationComponentUninstallException,
                ApplicationComponentInstallTimeoutException) as error:
            logger.error(f'Failed to upgrate <Applicaton ID="{application.id}">. {error.message}.')
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            await application_manager.event_manager.create(EventSchema(
                title='Application upgrade',
                message=f'Failed to upgrade application. {error.message.strip(".")}.',
                organization_id=application.organization.id,
                category=EventCategory.application,
                severity=EventSeverityLevel.error,
                data={'application_id': application.id}
            ))
            raise
        await application_manager.set_health_status(application, ApplicationHealthStatuses.healthy)

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
        manifest = load_template(application.manifest)
        try:
            hooks = [hook for hook in manifest.hooks.post_upgrade if hook.enabled]
            if hooks:
                await application_manager.event_manager.create(EventSchema(
                    title='Application upgrade',
                    message=f'Starting execution of post-upgrade hooks.',
                    organization_id=application.organization.id,
                    category=EventCategory.application,
                    data={'application_id': application.id}
                ))
            for hook in hooks:
                await application_manager.execute_hook(application, hook)
        except (ApplicationHookTimeoutException, ApplicationHookLaunchException) as error:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}">. '
                f'Failed to execute post-upgrade <Hook name="{error.hook.name}">.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            return
        await application_manager.set_state_status(application, ApplicationStatuses.deployed)

        # 2 stage template rendering. 1-st only with user inputs to be able fetch component's manifests. 2-nd with
        # fetched component's manifests.
        application.user_inputs = application_manager.get_inputs(new_template, application=application)
        raw_new_manifest = application_manager.render_manifest(new_template, application=application)
        application.manifest = raw_new_manifest
        components_manifests = await application_manager.get_components_manifests(application)
        raw_new_manifest = application_manager.render_manifest(
            new_template, application=application, components_manifests=components_manifests
        )
        application.manifest = raw_new_manifest
        application.template = new_template
        await application_manager.db.save(application)

        await application_manager.event_manager.create(EventSchema(
            title='Application upgrade',
            message=f'Application template was successfully upgraded.',
            organization_id=application.organization.id,
            category=EventCategory.application,
            data={
                'application_id': application.id,
                'new_template_id': new_template_id
            }
        ))
