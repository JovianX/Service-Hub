"""
Functionality for interaction with user database entities.
"""
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase

from application.db.session import get_session
from application.models.user import OAuthAccount
from application.models.user import User


async def get_user_db(session=Depends(get_session)):
    yield SQLAlchemyUserDatabase(session, User, OAuthAccount)
