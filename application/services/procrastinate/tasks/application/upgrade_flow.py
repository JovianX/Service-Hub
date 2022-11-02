import asyncio
import logging
from datetime import datetime
from datetime import timedelta

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from core.configuration import settings
from db.session import session_maker
from exceptions.application import ApplicationComponentInstallException
from exceptions.application import ApplicationComponentUninstallException
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


def render_new_application_manifest(application: Application, new_template: TemplateRevision) -> TemplateSchema:
    """
    Helper that renders new application's manifest using existing user input.
    """
    # Extending existing user inputs with defaults from new template.
    new_template_schema = load_template(new_template.template)
    input_defaults = new_template_schema.inputs_defaults
    user_inputs = {**input_defaults, **application.user_inputs}

    manifest_yaml = render_template(new_template.template, user_inputs)
    manifest = load_template(manifest_yaml)

    return manifest


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
        manifest = render_new_application_manifest(application, new_template)
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
        new_manifest = render_new_application_manifest(application, new_template)
        old_manifest: TemplateSchema = load_template(application.manifest)

        new_components_names = new_manifest.components_mapping.keys()
        old_components_names = old_manifest.components_mapping.keys()
        components_to_install = [
            new_manifest.components_mapping[component_name]
            for component_name in new_components_names - old_components_names
        ]
        components_to_remove = [
            old_manifest.components_mapping[component_name]
            for component_name in old_components_names - new_components_names
        ]
        components_to_update = [
            new_manifest.components_mapping[component_name]
            for component_name in old_components_names & new_components_names
        ]
        try:
            await asyncio.gather(*[
                application_manager.install_component(component, application, dry_run=dry_run)
                for component in manifest.components if component.enabled
            ])
        except ApplicationComponentInstallException:
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            await asyncio.gather(*[
                application_manager.uninstall_component(application, component)
                for component in manifest.components if component.enabled
            ])
            raise
        application_deadline = datetime.now() + timedelta(seconds=settings.APPLICATION_COMPONENTS_INSTALL_TIMEOUT)
        while datetime.now() < application_deadline:
            status = await application_manager.get_application_health_status(application)
            await application_manager.set_health_status(application, status)
            if status == ApplicationHealthStatuses.healthy:
                break
        else:
            logger.error(
                f'Failed to launch <Applicaton ID="{application.id}"> in '
                f'{settings.APPLICATION_COMPONENTS_INSTALL_TIMEOUT} seconds.'
            )
            await application_manager.set_state_status(application, ApplicationStatuses.error)
            raise ApplicationLaunchTimeoutException(f'Failed to start application in time.', application=application)

    await execute_post_upgrade_hooks.defer_async(application_id=application_id)


@procrastinate.task(name='application__run_post_upgrade_hooks')
async def execute_post_upgrade_hooks(application_id: int):
    """
    Executes application post-upgrade hooks.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        application = await application_manager.get_application(application_id)
        manifest: TemplateSchema = load_template(application.manifest)
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
