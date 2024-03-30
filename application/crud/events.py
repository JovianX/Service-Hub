"""
Classes responsible for interaction with events database entities.
"""
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from constants.events import EventCategory
from db.session import get_session
from models.event import Event

from .base import BaseDatabase


class EventDatabase(BaseDatabase):
    """
    CRUD operation for models.UserInvitation instances.
    """
    session: AsyncSession
    table: Event = Event

    async def list_for_application(self, organization_id: int, application_id: int) -> list[Event]:
        query = select(self.table).where(
            self.table.organization_id == organization_id,
            self.table.category == EventCategory.application,
            self.table.data['application_id'].as_integer() == application_id
        ).order_by(self.table.created_at.desc())
        result = await self.session.execute(query)

        return result.unique().scalars().all()

    async def list_for_helm_repository(self, organization_id: int, repository_name: str) -> list[Event]:
        query = select(self.table).where(
            self.table.organization_id == organization_id,
            self.table.category == EventCategory.helm,
            self.table.data['repository_name'].as_string() == repository_name
        )
        result = await self.session.execute(query)

        return result.unique().scalars().all()

    async def list_for_helm_release(
        self, organization_id: int, context_name: str, namespace: str, release_name: str
    ) -> list[Event]:
        query = select(self.table).where(
            self.table.organization_id == organization_id,
            self.table.category == EventCategory.helm,
            self.table.data['context'].as_string() == context_name,
            self.table.data['namespace'].as_string() == namespace,
            self.table.data['release_name'].as_string() == release_name
        )
        result = await self.session.execute(query)

        return result.unique().scalars().all()


async def get_event_db(session=Depends(get_session)):
    yield EventDatabase(session)
