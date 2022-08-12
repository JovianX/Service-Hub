"""
Classes responsible for interaction with organization database entities.
"""
from typing import Any
from typing import Dict

from sqlalchemy import delete
from sqlalchemy import select
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from exceptions.db import DuplicatesFoundException
from exceptions.db import RecordNotFoundException
from exceptions.db import UnknownModelAttributeException


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

    async def get(self, query=None, **parameters):
        """
        Returns returns single record. If record not found or found more then
        one, error is raised.
        """
        records = await self.list(query, **parameters)
        if not records:
            raise RecordNotFoundException(
                self.table,
                f'Failed to get record of {self.table.__name__}. No correspond record with {parameters} parameters.'
            )
        if len(records) > 1:
            raise DuplicatesFoundException(
                self.table,
                f'Failed to get record of {self.table.__name__}. More than one records found with {parameters} '
                f'parameters.',
                records
            )

        return records[0]

    async def list(self, query=None, **parameters) -> list:
        if query is None:
            query = select(self.table)
        query = self._apply_filter_parameters(query, **parameters)
        result = await self.session.execute(query)

        return result.unique().scalars().all()

    async def update(self, data: dict, **parameters) -> None:
        """
        Updates record.
        """
        query = update(self.table)
        query = self._apply_filter_parameters(query, **parameters)
        query = query.values(**data)
        result = await self.session.execute(query)
        await self.session.commit()
        if result.rowcount < 1:
            raise RecordNotFoundException(
                self.table,
                f'Failed to update record(s) of {self.table.__name__}. No correspond record(s) to {parameters} '
                f'parameters.'
            )

    async def delete(self, **parameters: dict) -> None:
        query = delete(self.table)
        query = self._apply_filter_parameters(query, **parameters)
        result = await self.session.execute(query)
        await self.session.commit()

        deleted_row_count = result.rowcount
        if deleted_row_count < 1:
            raise RecordNotFoundException(
                self.table,
                f'Failed to delete record(s) of {self.table.__name__}. No correspond record(s) to {parameters} '
                f'parameters.'
            )

    async def save(self, instance):
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)

    def _apply_filter_parameters(self, query, **parameters: dict):
        """
        Helper to apply `where` filter parameters.
        """
        for attribute, value in parameters.items():
            if not hasattr(self.table, attribute):
                raise UnknownModelAttributeException(
                    self.table,
                    f'Model {self.table.__name__} does not have attribute "{attribute}".'
                )
            query = query.where(getattr(self.table, attribute) == value)

        return query
