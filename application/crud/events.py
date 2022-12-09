"""
Classes responsible for interaction with events database entities.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session
from models.event import Event

from .base import BaseDatabase


class EventDatabase(BaseDatabase):
    """
    CRUD operation for models.UserInvitation instances.
    """
    session: AsyncSession
    table: Event = Event


async def get_event_db(session=Depends(get_session)):
    yield EventDatabase(session)
