import logging

from constants.events import EventCategory
from constants.events import EventSeverityLevel
from db.session import session_maker
from schemas.events import EventSchema
from constants.helm import ReleaseHealthStatuses
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
            try:
                condition = await application_manager.get_application_health_condition(application)
            except Exception as error:
                logger.exception(f'Skipping health check of <Application ID={application.id}>. {error}')
                continue
            health_status = condition['status']
            if application.health != health_status:
                if health_status == ReleaseHealthStatuses.unhealthy:
                    severity = EventSeverityLevel.warning
                else:
                    severity = EventSeverityLevel.info
                await application_manager.event_manager.create(EventSchema(
                    title='Change of application health.',
                    message=f'Automatic periodic application health check detected health condition change. '
                            f'Application became {health_status}.',
                    organization_id=application.organization.id,
                    category=EventCategory.application,
                    severity=severity,
                    data={
                        'application_id': application.id,
                        'problem_components': {
                            component.name: details for component, details in condition['problem_components'].items()
                        },
                        'health_status': health_status
                    }
                ))
                await application_manager.set_health_status(application, condition['status'])
