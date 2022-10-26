"""
Applications management.
"""
import logging

from fastapi import Depends
from fastapi import status

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses
from constants.helm import ReleaseHealthStatuses
from crud.applications import ApplicationDatabase
from crud.applications import get_application_db
from exceptions.common import CommonException
from exceptions.helm import HelmException
from exceptions.helm import ReleaseNotFoundException
from exceptions.templates import InvalidUserInputsException
from managers.helm.manager import HelmManager
from managers.organizations.manager import get_organization_manager
from models.application import Application
from models.organization import Organization
from models.template import TemplateRevision
from models.user import User
from utils.template import load_template
from utils.template import render_template
from utils.template import validate_inputs


logger = logging.getLogger(__name__)


class ApplicationManager:
    """
    Deployed application business logic.
    """
    db: ApplicationDatabase
    helm_manager: HelmManager

    def __init__(self, db: ApplicationDatabase, helm_manager: HelmManager) -> None:
        self.db = db
        self.helm_manager = helm_manager

    async def install(self, context_name: str, namespace: str, user: User, template: TemplateRevision, inputs: dict,
                      dry_run: bool = False) -> None:
        """
        Installs application from provided manifest.
        """
        validate_inputs(template.template, inputs)
        manifest = render_template(template.template, inputs=inputs)
        manifest_schema = load_template(manifest)

        results = {}
        try:
            for index, chart in enumerate(manifest_schema.components):
                results[chart.name] = await self.helm_manager.install_chart(
                    organization=user.organization,
                    context_name=context_name,
                    namespace=namespace,
                    release_name=chart.name,
                    chart_name=chart.chart,
                    version=chart.version,
                    values=chart.values,
                    dry_run=dry_run
                )
        except HelmException:
            if not dry_run:
                logging.exception(
                    f'Application installation failed. Failed to install Helm chart "{chart.chart}". '
                    f'<Organization: id={user.organization.id}> <Template: id={template.id}>'
                )
                for chart in reversed(manifest_schema.components[:index]):
                    try:
                        await self.helm_manager.uninstall_release(
                            organization=user.organization,
                            context_name=context_name,
                            namespace=namespace,
                            release_name=chart.name
                        )
                    except HelmException:
                        logging.exception(
                            f'Failed to remove release "{chart.name}" during clean up after application installation '
                            f'failure. <Organization: id={user.organization.id}> <Template: id={template.id}>'
                        )
                        pass
            raise
        application_record = None
        if not dry_run:
            application = {
                'name': manifest_schema.name,
                'description': '',
                'manifest': manifest,
                'status': ApplicationStatuses.running,
                'health': ApplicationHealthStatuses.unhealthy,
                'context_name': context_name,
                'namespace': namespace,
                'user_inputs': inputs,
                'template_id': template.id,
                'creator_id': str(user.id),
                'organization_id': user.organization.id
            }
            application_record = await self.db.create(application)

        return {
            'application': application_record,
            'results': results
        }

    async def upgrade(self, application: Application, template: TemplateRevision, dry_run: bool = False) -> None:
        """
        Upgrades application manifest to given template.
        """
        # Extending of user inputs with defaults from new template.
        new_template_schema = load_template(template.template)
        input_defaults = {
            input.name: input.default for input in new_template_schema.inputs if 'default' in input.__fields_set__
        }
        user_inputs = {**input_defaults, **application.user_inputs}

        rendered_template = render_template(template.template, user_inputs)
        new_template_schema = load_template(rendered_template)
        old_template_schema = load_template(application.manifest)

        new_components_names = new_template_schema.components_mapping.keys()
        old_components_names = old_template_schema.components_mapping.keys()
        charts_to_install = new_components_names - old_components_names
        releases_to_remove = old_components_names - new_components_names
        releases_to_update = old_components_names & new_components_names

        install_results = {}
        installed_charts = []
        for release_name in charts_to_install:
            chart = new_template_schema.components_mapping[release_name]
            try:
                install_results[chart.name] = await self.helm_manager.install_chart(
                    organization=application.organization,
                    context_name=application.context_name,
                    namespace=application.namespace,
                    release_name=chart.name,
                    chart_name=chart.chart,
                    version=chart.version,
                    values=chart.values,
                    dry_run=dry_run
                )
                installed_charts.append(chart)
            except HelmException:
                if not dry_run:
                    logging.exception(
                        f'Application upgrade failed. Failed to install Helm chart "{chart.chart}". '
                        f'<Organization: id={application.organization.id}> <Template: id={template.id}>'
                    )
                    for chart in reversed(installed_charts):
                        try:
                            await self.helm_manager.uninstall_release(
                                organization=application.organization,
                                context_name=application.context_name,
                                namespace=application.namespace,
                                release_name=chart.name
                            )
                        except HelmException:
                            logging.exception(
                                f'Failed to remove release "{chart.name}" during clean up after application upgrade '
                                f'failure. <Organization: id={application.organization.id}> '
                                f'<Template: id={template.id}>'
                            )
                            pass
                raise

        update_results = {}
        for release_name in releases_to_update:
            chart = new_template_schema.components_mapping[release_name]
            update_results[release_name] = await self.helm_manager.update_release(
                organization=application.organization,
                context_name=application.context_name,
                namespace=application.namespace,
                release_name=release_name,
                chart_name=chart.chart,
                values=chart.values,
                dry_run=dry_run
            )

        for release_name in releases_to_remove:
            chart = old_template_schema.components_mapping[release_name]
            try:
                await self.helm_manager.uninstall_release(
                    organization=application.organization,
                    context_name=application.context_name,
                    namespace=application.namespace,
                    release_name=chart.name,
                    dry_run=dry_run
                )
            except HelmException:
                if not dry_run:
                    logging.exception(
                        f'Failed to remove release "{chart.name}" during application upgrade. '
                        f'<Organization: id={application.organization.id}> <Template: id={application.template.id}>'
                    )
                pass

        if not dry_run:
            application.manifest = rendered_template
            application.template = template
            application.user_inputs = user_inputs
            await self.db.save(application)

        return {
            'installed_releases': install_results,
            'updated_releases': update_results,
            'uninstalled_releases': list(releases_to_remove)
        }

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
        Terminates application. Removes all resources related with application.
        """
        manifest_schema = load_template(application.manifest)
        for chart in manifest_schema.components:
            try:
                await self.helm_manager.uninstall_release(
                    organization=application.organization,
                    context_name=application.context_name,
                    namespace=application.namespace,
                    release_name=chart.name
                )
            except HelmException:
                logging.exception(
                    f'Failed to remove release "{chart.name}" during application termination. '
                    f'<Organization: id={application.organization.id}> <Template: id={application.template.id}>'
                )
                pass
        await self.db.delete(id=application.id)

    async def get_application_health_status(self, application: Application) -> ApplicationHealthStatuses:
        """
        Returns application status.
        """
        template_schema = load_template(application.manifest)
        application_components_healthy = []
        for component in template_schema.components:
            try:
                component_health_status = await self.helm_manager.release_health_status(
                    application.organization,
                    application.context_name,
                    application.namespace,
                    component.name
                )
            except ReleaseNotFoundException:
                application_components_healthy.append(False)
                break
            application_components_healthy.append(
                component_health_status['status'] == ReleaseHealthStatuses.healthy
            )
        if all(application_components_healthy):
            return ApplicationHealthStatuses.healthy
        else:
            return ApplicationHealthStatuses.unhealthy

    async def get_organization_application(self, application_id: int, organization: Organization) -> Application:
        """
        Returns organization's application record.
        """
        return await self.db.get(id=application_id, organization_id=organization.id)

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


async def get_application_manager(
    db=Depends(get_application_db),
    organization_manager=Depends(get_organization_manager)
):
    helm_manager = HelmManager(organization_manager)
    yield ApplicationManager(db, helm_manager)
