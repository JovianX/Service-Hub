"""
Classes responsible for interaction with user invitations database entities.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session
from models.invitation import UserInvitation

from .base import BaseDatabase


class InvitationDatabase(BaseDatabase):
    """
    CRUD operation for models.UserInvitation instances.
    """
    session: AsyncSession
    table: UserInvitation = UserInvitation


async def get_invitation_db(session=Depends(get_session)):
    yield InvitationDatabase(session)
