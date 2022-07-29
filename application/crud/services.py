"""
Classes responsible for interaction with services database entities.
"""
from fastapi import Depends
from sqlalchemy import delete
from sqlalchemy import select
from sqlalchemy import update
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

    async def get_organization_service(self, service_id: int, organization_id: int) -> Service:
        """
        Returns organization's service.
        """
        result = await self.session.execute(
            select(self.table).where(self.table.id == service_id, self.table.organization_id == organization_id)
        )
        record = result.unique().scalars().first()
        if record is None:
            raise ServiceDoesNotExistException(
                f'Failed to update service. Service with ID: {service_id} does not exist.'
            )

        return record

    async def list_by_organization(self, organization_id: int) -> None:
        result = await self.session.execute(
            select(self.table).where(self.table.organization_id == organization_id)
        )

        return result.unique().scalars().all()

    async def update_organization_service_by_id(self, organization_id: int, service_id: int, data: dict) -> None:
        """
        Updates organization service.
        """
        result = await self.session.execute(
            update(self.table)
            .where(self.table.organization_id == organization_id, self.table.id == service_id)
            .values(**data)
        )
        await self.session.commit()
        if result.rowcount < 1:
            raise ServiceDoesNotExistException(
                f'Failed to update service. Service with ID: {service_id} does not exist.'
            )

    async def delete_organization_service(self, organization_id, service_id: int | str) -> None:
        result = await self.session.execute(
            delete(self.table).where(self.table.id == service_id, self.table.organization_id == organization_id)
        )
        await self.session.commit()

        deleted_row_count = result.rowcount
        if deleted_row_count < 1:
            raise ServiceDoesNotExistException(
                f'Failed to delete service. Service with ID: {service_id} does not exist.'
            )


async def get_service_db(session=Depends(get_session)):
    yield ServiceDatabase(session)
