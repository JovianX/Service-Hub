"""
Classes responsible for interaction with user access token database entities.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session
from models.access_token import AccessToken

from .base import BaseDatabase


class AccessTokenDatabase(BaseDatabase):
    """
    CRUD operation for models.AccessToken instances.
    """
    session: AsyncSession
    table: AccessToken = AccessToken


async def get_access_token_db(session=Depends(get_session)):
    yield AccessTokenDatabase(session)
