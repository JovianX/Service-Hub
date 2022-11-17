from sqlalchemy.ext.asyncio import AsyncSession

from crud.applications import ApplicationDatabase
from crud.organizations import OrganizationDatabase
from crud.templates import TemplateDatabase
from crud.events import EventDatabase
from managers.applications import ApplicationManager
from managers.helm.manager import HelmManager
from managers.events import EventManager
from managers.organizations.manager import OrganizationManager
from managers.templates import TemplateManager


def get_application_manager(session: AsyncSession) -> ApplicationManager:
    """
    Helper to create application manager.
    """
    organization_manager = OrganizationManager(OrganizationDatabase(session))
    event_manager = EventManager(EventDatabase(session))
    helm_manager = HelmManager(organization_manager, event_manager)

    return ApplicationManager(ApplicationDatabase(session), organization_manager, event_manager, helm_manager)


def get_template_manager(session: AsyncSession) -> TemplateManager:
    """
    Helper that initializes template manager.
    """
    return TemplateManager(TemplateDatabase(session))
