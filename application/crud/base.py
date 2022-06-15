"""
Classes responsible for interaction with organization database entities.
"""
from typing import Any
from typing import Dict

from sqlalchemy.ext.asyncio import AsyncSession


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
