import logging

from crud.applications import ApplicationDatabase
from crud.organizations import OrganizationDatabase
from db.session import session_maker
from managers.applications import ApplicationManager
from managers.helm.manager import HelmManager
from managers.organizations.manager import OrganizationManager

from ..application import procrastinate


logger = logging.getLogger(__name__)


@procrastinate.periodic(cron='*/1 * * * *')
@procrastinate.task
async def check_applications_health(*args, **kwargs):
    async with session_maker() as session:
        organization_manager = OrganizationManager(OrganizationDatabase(session))
        helm_manager = HelmManager(organization_manager)
        application_manager = ApplicationManager(ApplicationDatabase(session), helm_manager)
        applications = await application_manager.list_all_applications()
        for application in applications:
            status = await application_manager.get_application_health_status(application)
            application.health = status
            await application_manager.db.save(application)
