"""
User invitations business logic.
"""
from datetime import datetime
from datetime import timedelta

from fastapi import Depends
from fastapi import status

from constants.invitations import InvitationStatuses
from core.configuration import settings
from crud.invitations import InvitationDatabase
from crud.invitations import get_invitation_db
from exceptions.common import CommonException
from exceptions.db import RecordNotFoundException
from models.invitation import UserInvitation
from models.organization import Organization
from models.user import User
from utils.email import send_email
from utils.invitation import is_invitation_expired


class InvitationManager:
    """
    User invitation manager.
    """
    db: InvitationDatabase

    def __init__(self, db: InvitationDatabase) -> None:
        self.db = db

    async def create(self, user: User, invitee_email: str, expiration_period: int | None = None) -> UserInvitation:
        """
        Creates new user invitation.
        """
        try:
            existing_invitation = await self.db.get(organization_id=user.organization.id, email=invitee_email)
        except RecordNotFoundException:
            existing_invitation = None
        if existing_invitation is not None:
            raise CommonException(
                f'Invitation for user with email "{invitee_email}" already exists.',
                status_code=status.HTTP_409_CONFLICT
            )
        if expiration_period is None:
            expiration_period = 24  # One day.
        invitation_data = {
            'email': invitee_email,
            'status': InvitationStatuses.pending,
            'expiration_period': expiration_period,
            'creator': user,
            'organization': user.organization
        }
        invitation_record = await self.db.create(invitation_data)

        return invitation_record

    async def get_invitation(self, organization: Organization, id: str) -> UserInvitation:
        """
        Returns organization's user invitation.
        """
        return await self.db.get(organization_id=organization.id, id=id)

    async def get_invitation(self, id: str, **parameters) -> UserInvitation:
        """
        Returns user invitation.
        """
        return await self.db.get(id=id, **parameters)

    async def list_invitations(self, organization: Organization) -> list[UserInvitation]:
        """
        Returns list of organization's user invitations.
        """
        return await self.db.list(organization_id=organization.id)

    async def delete_invitation(self, invitation: UserInvitation) -> None:
        """
        Deletes invitation.
        """
        if invitation.status == InvitationStatuses.used:
            raise CommonException(
                'Invitation was used and cannot be deleted',
                status_code=status.HTTP_403_FORBIDDEN
            )
        await self.db.delete(id=invitation.id)

    @staticmethod
    def is_valid(invitation: UserInvitation) -> bool:
        """
        Validates invitation for using during user creation.
        """
        is_expired = is_invitation_expired(invitation.created_at, invitation.expiration_period)
        if invitation.status == InvitationStatuses.pending and is_expired:
            raise CommonException('Invitation is expired.', status_code=status.HTTP_410_GONE)
        if invitation.status == InvitationStatuses.used:
            raise CommonException('Invitation already used.', status_code=status.HTTP_403_FORBIDDEN)

    async def use(self, invitation: UserInvitation, user: User):
        """
        Checks and marks invitation as used.
        """
        invitation.status = InvitationStatuses.used
        invitation.created_user_id = user.id
        await self.db.save(invitation)

    async def send_email(self, invitation: UserInvitation) -> None:
        """
        Sends E-mail with link to join organization.
        """
        if invitation.email_sent_at:
            now = datetime.now()
            block_deadline = invitation.email_sent_at + timedelta(seconds=settings.INVITATION_EMAIL_SENDING_BLOCK)
            if now < block_deadline:
                raise CommonException(
                    'Invitation email was recently sent. Try again in while.',
                    status_code=status.HTTP_403_FORBIDDEN
                )
        # NOTE: Link should lead to FE page. Should be replaced to real when FE
        #       will be deployed. Hardcoding for now.
        link = self.get_invitation_link(invitation)
        await send_email(
            invitation.email,
            f'You have been invited to join "{invitation.organization.title}" organization!',
            f'To to join organization\'s team click following link: {link}'
        )
        invitation.email_sent_at = datetime.now()
        await self.db.save(invitation)

    def get_invitation_link(self, invitation: UserInvitation) -> str:
        """
        Returns link clicking on which user can finish registration.
        """
        return f'http://{settings.UI_HOST}/sign-up?invite_id={invitation.id}'


async def get_invitation_manager(db=Depends(get_invitation_db)):
    yield InvitationManager(db)
