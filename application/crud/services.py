"""
Classes responsible for interaction with services database entities.
"""
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from application.db.session import get_session
from application.exceptions.service import ServiceDoesNotExistException
from application.models.service import Service

from .base import BaseDatabase


class ServiceDatabase(BaseDatabase):
    """
    CRUD operation for models.Service instances.
    """
    session: AsyncSession
    table: Service = Service

    async def list_by_organization(self, organization_id: int) -> None:
        result = await self.session.execute(
            select(self.table).where(self.table.organization_id == organization_id)
        )

        return result.unique().scalars().all()

    async def delete_by_id(self, id: int | str) -> None:
        deleted_row_count = await super().delete_by_id(id)
        if deleted_row_count < 1:
            raise ServiceDoesNotExistException(f'Failed to delete service. Service with ID: {id} does not exist.')


async def get_service_db(session=Depends(get_session)):
    yield ServiceDatabase(session)
