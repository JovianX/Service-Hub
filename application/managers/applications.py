"""
Applications management.
"""
from fastapi import Depends

from application.constants.applications import ApplicationStatuses
from application.crud.applications import ApplicationDatabase
from application.crud.applications import get_application_db
from application.exceptions.helm import HelmException
from application.managers.helm.manager import HelmManager
from application.managers.organizations.manager import get_organization_manager
from application.models.template import TemplateRevision
from application.models.user import User
from application.utils.template import load_template
from application.utils.template import render_template


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
            for chart in manifest_schema.charts:
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
            for chart in manifest_schema.charts:
                try:
                    await self.helm_manager.uninstall_release(
                        organization=user.organization,
                        context_name=context_name,
                        namespace=namespace,
                        release_name=chart.name
                    )
                except HelmException:
                    pass
            raise
        if not dry_run:
            application = {
                'name': manifest_schema.name,
                'description': '',
                'manifest': manifest,
                'status': ApplicationStatuses.running,
                'template_id': template.id,
                'creator_id': str(user.id),
                'organization_id': user.organization.id
            }
            await self.db.create(application)

        return results


async def get_application_manager(
    db=Depends(get_application_db),
    organization_manager=Depends(get_organization_manager)
):
    helm_manager = HelmManager(organization_manager)
    yield ApplicationManager(db, helm_manager)
