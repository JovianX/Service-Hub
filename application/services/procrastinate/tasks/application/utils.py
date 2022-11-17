from sqlalchemy.ext.asyncio import AsyncSession

from crud.applications import ApplicationDatabase
from crud.events import EventDatabase
from crud.organizations import OrganizationDatabase
from crud.templates import TemplateDatabase
from db.session import session_maker
from managers.applications import ApplicationManager
from managers.helm.manager import HelmManager
from managers.events import EventManager
from managers.helm.manager import HelmManager
from managers.organizations.manager import OrganizationManager
from managers.templates import TemplateManager


def get_application_manager(session: AsyncSession) -> ApplicationManager:
    """
    Helper to create application manager.
    """
    return ApplicationManager(
        ApplicationDatabase(session_maker()),
        OrganizationManager(OrganizationDatabase(session_maker())),
        EventManager(EventDatabase(session_maker())),
        HelmManager(
            OrganizationManager(OrganizationDatabase(session_maker())),
            EventManager(EventDatabase(session_maker()))
        )
    )


def get_template_manager(session: AsyncSession) -> TemplateManager:
    """
    Helper that initializes template manager.
    """
    return TemplateManager(TemplateDatabase(session_maker()))
