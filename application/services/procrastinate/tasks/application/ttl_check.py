import logging
from datetime import datetime

from db.session import session_maker
from services.procrastinate.application import procrastinate

from .terminate_flow import execute_pre_terminate_hooks
from .utils import get_application_manager


logger = logging.getLogger(__name__)


@procrastinate.periodic(cron='*/1 * * * *')
@procrastinate.task(
    name='application__ttl_check',
    queueing_lock='application__ttl_check',
    lock='application__ttl_check'
)
async def check_applications_ttl(*args, **kwargs):
    """
    Checks applications health status.
    """
    async with session_maker() as session:
        application_manager = get_application_manager(session)
        applications = await application_manager.list_all_applications()
        for application in applications:
            now = datetime.now()
            if application.ttl is not None and application.ttl < now:
                await execute_pre_terminate_hooks.defer_async(application_id=application.id)
