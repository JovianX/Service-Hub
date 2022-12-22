"""
User access tokens business logic.
"""
from datetime import datetime

from fastapi import Depends
from fastapi import status

from constants.access_tokens import AccessTokenStatuses
from constants.events import EventCategory
from crud.access_tokens import AccessTokenDatabase
from crud.access_tokens import get_access_token_db
from exceptions.common import CommonException
from managers.events import EventManager
from managers.events import get_event_manager
from models.access_token import AccessToken
from models.organization import Organization
from models.user import User
from schemas.events import EventSchema


class AccessTokenManager:
    """
    User access tokens manager.
    """
    db: AccessTokenDatabase
    event_manager: EventManager

    def __init__(self, db: AccessTokenDatabase, event_manager: EventManager) -> None:
        self.db = db
        self.event_manager = event_manager

    async def create(
        self, creator: User, user: User, comment: str | None = None, expiration_date: datetime | None = None
    ) -> AccessToken:
        """
        Creates new user access token.
        """
        if comment is None:
            comment = ''
        if user.organization.id != creator.organization.id:
            raise CommonException(
                'Token creator and token owner belongs to different organizations.',
                status_code=status.HTTP_412_PRECONDITION_FAILED
            )
        token_data = {
            'status': AccessTokenStatuses.active,
            'comment': comment,
            'expiration_date': expiration_date,
            'user_id': str(user.id),
            'creator_id': str(creator.id),
            'organization_id': creator.organization.id
        }
        record = await self.db.create(token_data)
        if expiration_date is None:
            message = 'Permanent user access token created.'
        else:
            message = 'Temporary user access token created.'
        await self.event_manager.create(EventSchema(
            title='User access token created.',
            message=message,
            organization_id=creator.organization.id,
            category=EventCategory.access_token,
            data={
                'token': str(record.id),
                'user': str(user.id),
                'creator': str(creator.id),
                'expiration_date': expiration_date
            }
        ))

        return record

    async def get_access_token(self, organization: Organization, token: str) -> AccessToken:
        """
        Returns organization's user access token.
        """
        return await self.db.get(organization_id=organization.id, id=token)

    async def list_organization_access_tokens(self, organization: Organization) -> list[AccessToken]:
        """
        List organization's user access tokens.
        """
        return await self.db.list(organization_id=organization.id)

    async def set_status(self, token: AccessToken, status: AccessTokenStatuses) -> None:
        """
        Changes status of user access token.
        """
        if status not in AccessTokenStatuses:
            raise ValueError(f'Unknown user access token status "{status}".')
        if token.status != status:
            old_status = token.status
            token.status = status
            await self.db.save(token)
            await self.event_manager.create(EventSchema(
                title='User access token status changed.',
                message=f'User access token status changed from {old_status} to {status}.',
                organization_id=token.organization.id,
                category=EventCategory.access_token,
                data={
                    'token': str(token.id),
                    'old_status': old_status,
                    'new_status': status
                }
            ))

    async def set_expiration_date(self, token: AccessToken, expiration_date: datetime | None) -> None:
        """
        Sets new or removes old access token expiration date.
        """
        if token.expiration_date != expiration_date:
            old_expiration_date = token.expiration_date
            token.expiration_date = expiration_date
            await self.db.save(token)
            await self.event_manager.create(EventSchema(
                title='User access token expiration date changed.',
                message=f'User access token expiration date changed from {old_expiration_date} to {expiration_date}.',
                organization_id=token.organization.id,
                category=EventCategory.access_token,
                data={
                    'token': str(token.id),
                    'old_expiration_date': old_expiration_date.timestamp() if old_expiration_date is not None else None,
                    'new_expiration_date': expiration_date.timestamp() if expiration_date is not None else None
                }
            ))

    async def set_comment(self, token: AccessToken, comment: str) -> None:
        """
        Sets new access token description.
        """
        if token.comment != comment:
            old_comment = token.comment
            token.comment = comment
            await self.db.save(token)
            await self.event_manager.create(EventSchema(
                title='User access token comment changed.',
                message=f'User access token comment changed.',
                organization_id=token.organization.id,
                category=EventCategory.access_token,
                data={
                    'token': str(token.id),
                    'old_comment': old_comment,
                    'new_comment': comment
                }
            ))

    async def delete_access_token(self, token: AccessToken, deleter: User) -> None:
        """
        Deletes user access token.
        """
        await self.event_manager.create(EventSchema(
            title='User access token deleted.',
            message=f'User access token deleted.',
            organization_id=token.organization.id,
            category=EventCategory.access_token,
            data={
                'token': str(token.id),
                'deleted_by': str(deleter.id)
            }
        ))
        await self.db.delete(id=token.id)


async def get_access_token_manager(db=Depends(get_access_token_db), event_namager=Depends(get_event_manager)):
    yield AccessTokenManager(db, event_namager)
