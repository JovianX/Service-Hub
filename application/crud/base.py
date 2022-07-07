"""
Classes responsible for interaction with organization database entities.
"""
from typing import Any
from typing import Dict

from sqlalchemy import delete
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from application.exceptions.db import RecordNotFoundException


class BaseDatabase:
    """
    Base CRUD operation model instances.
    """
    session: AsyncSession

    @property
    def table(self):
        """
        Returns class that represents model.
        """
        raise NotImplementedError()

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, create_dict: Dict[str, Any]):
        instance = self.table(**create_dict)
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)

        return instance

    async def get_by_id(self, id: int | str):
        """
        Returns returns record which ID matches given.
        """
        result = await self.session.execute(
            select(self.table).where(self.table.id == id)
        )
        record = result.unique().scalars().first()
        if record is None:
            raise RecordNotFoundException(
                self.table, f'{self.table.__name__} with ID: "{id}" does not exist.'
            )

        return record

    async def update(self, instance, update_dict: Dict[str, Any]):
        for key, value in update_dict.items():
            setattr(instance, key, value)
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)

        return instance

    async def delete(self, instance) -> None:
        await self.session.delete(instance)
        await self.session.commit()

    async def delete_by_id(self, id: int | str) -> None:
        """
        Deletes record by its ID. ID can be integer of string(UUID).
        """
        result = await self.session.execute(
            delete(self.table).where(self.table.id == id)
        )
        await self.session.commit()

        return result.rowcount

    async def save(self, instance):
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
