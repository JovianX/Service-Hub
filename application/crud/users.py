"""
Functionality for interaction with user database entities.
"""
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import select

from db.session import get_session
from exceptions.db import UnknownModelAttributeException
from models.user import OAuthAccount
from models.user import User


class UserDatabase(SQLAlchemyUserDatabase):
    """
    CRUD operation for models.User instances.
    """
    async def list(self, query=None, **parameters) -> list:
        if query is None:
            query = select(self.user_table)
        query = self._apply_filter_parameters(query, **parameters)
        result = await self.session.execute(query)

        return result.unique().scalars().all()

    async def save(self, instance):
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)

    def _apply_filter_parameters(self, query, **parameters: dict):
        """
        Helper to apply `where` filter parameters.
        """
        for attribute, value in parameters.items():
            if not hasattr(self.user_table, attribute):
                raise UnknownModelAttributeException(
                    self.user_table,
                    f'Model {self.user_table.__name__} does not have attribute "{attribute}".'
                )
            query = query.where(getattr(self.user_table, attribute) == value)

        return query


async def get_user_db(session=Depends(get_session)):
    yield UserDatabase(session, User, OAuthAccount)
