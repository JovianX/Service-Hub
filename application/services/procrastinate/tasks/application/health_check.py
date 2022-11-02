import logging

from db.session import session_maker
from services.procrastinate.application import procrastinate

from .utils import get_application_manager


logger = logging.getLogger(__name__)


@procrastinate.periodic(cron='*/1 * * * *')
@procrastinate.task(name='application__check_health')
async def check_applications_health(*args, **kwargs):
    """
    Checks applications health status.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        applications = await application_manager.list_all_applications()
        for application in applications:
            status = await application_manager.get_application_health_status(application)
            await application_manager.set_health_status(application, status)
