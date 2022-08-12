"""
Classes responsible for interaction with organization database entities.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session
from models.organization import Organization

from .base import BaseDatabase


class OrganizationDatabase(BaseDatabase):
    """
    CRUD operation for models.Organization instances.
    """
    session: AsyncSession
    table: Organization = Organization


async def get_organization_db(session=Depends(get_session)):
    yield OrganizationDatabase(session)
