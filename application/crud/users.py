"""
Functionality for interaction with user database entities.
"""
from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase

from db.session import get_session
from models.user import OAuthAccount
from models.user import User


async def get_user_db(session=Depends(get_session)):
    yield SQLAlchemyUserDatabase(session, User, OAuthAccount)
