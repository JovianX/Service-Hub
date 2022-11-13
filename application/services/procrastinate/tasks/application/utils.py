from sqlalchemy.ext.asyncio import AsyncSession

from crud.applications import ApplicationDatabase
from crud.organizations import OrganizationDatabase
from crud.templates import TemplateDatabase
from managers.applications import ApplicationManager
from managers.organizations.manager import OrganizationManager
from managers.templates import TemplateManager


def get_application_manager(session: AsyncSession) -> ApplicationManager:
    """
    Helper to create application manager.
    """
    organization_manager = OrganizationManager(OrganizationDatabase(session))

    return ApplicationManager(ApplicationDatabase(session), organization_manager)


def get_template_manager(session: AsyncSession) -> TemplateManager:
    """
    Helper that initializes template manager.
    """
    return TemplateManager(TemplateDatabase(session))
