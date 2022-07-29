"""
Applications management.
"""
import logging

from fastapi import Depends
from fastapi import status

from application.constants.applications import ApplicationStatuses
from application.crud.applications import ApplicationDatabase
from application.crud.applications import get_application_db
from application.exceptions.common import CommonException
from application.exceptions.helm import HelmException
from application.managers.helm.manager import HelmManager
from application.managers.organizations.manager import get_organization_manager
from application.models.application import Application
from application.models.organization import Organization
from application.models.template import TemplateRevision
from application.models.user import User
from application.utils.template import load_template
from application.utils.template import render_template


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
        manifest = render_template(template.template, inputs=inputs)
        manifest_schema = load_template(manifest)

        results = {}
        try:
            for index, chart in enumerate(manifest_schema.charts):
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
            logging.exception(
                f'Application installation failed. Failed to install Helm chart "{chart.chart}". '
                f'<Organization: id={user.organization.id}> <Template: id={template.id}>'
            )
            for chart in reversed(manifest_schema.charts[:index]):
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

    async def update(
        self, application: Application, organization: Organization, values: dict[str, dict], dry_run: bool = False
    ) -> None:
        """
        Updates application release's values.
        """
        manifest = load_template(application.manifest)
        superfluous_releases = values.keys() - manifest.chart_mapping.keys()
        if superfluous_releases:
            raise CommonException(
                f'Application update failed. Found superfluous releases that absent in application manifes: '
                f'{", ".join(superfluous_releases)}',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        results = {}
        for release_name, release_values in values.items():
            results[release_name] = await self.helm_manager.update_release(
                organization=organization,
                context_name=application.context_name,
                namespace=application.namespace,
                release_name=release_name,
                chart_name=manifest.chart_mapping[release_name].chart,
                values=[release_values],
                dry_run=dry_run
            )

        return results

    async def terminate(self, application: Application, organization: Organization) -> None:
        """
        Terminates application. Removes all resources related with application.
        """
        manifest_schema = load_template(application.manifest)
        for chart in manifest_schema.charts:
            try:
                await self.helm_manager.uninstall_release(
                    organization=organization,
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


async def get_application_manager(
    db=Depends(get_application_db),
    organization_manager=Depends(get_organization_manager)
):
    helm_manager = HelmManager(organization_manager)
    yield ApplicationManager(db, helm_manager)
