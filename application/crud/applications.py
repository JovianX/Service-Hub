"""
Classes responsible for interaction with application database entities.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session
from models.application import Application

from .base import BaseDatabase


class ApplicationDatabase(BaseDatabase):
    """
    CRUD operation for models.Application instances.
    """
    session: AsyncSession
    table: Application = Application


async def get_application_db(session=Depends(get_session)):
    yield ApplicationDatabase(session)
