"""
Classes responsible for interaction with organization database entities.
"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.organization import Organization
from .base import BaseDatabase


class OrganizationDatabase(BaseDatabase):
    """
    CRUD operation for models.Organization instances.
    """
    session: AsyncSession
    table: Organization = Organization
