"""
Invitations related API endpoints.
"""
import logging
from uuid import UUID

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path

from core.authentication import AuthorizedUser
from core.authentication import current_active_user
from managers.invitations import InvitationManager
from managers.invitations import get_invitation_manager
from models.user import User

from ..schemas.invitations import CreateSchema
from ..schemas.invitations import InvitationResponseSchema


logger = logging.getLogger(__name__)

router = APIRouter()


@router.post('/', response_model=InvitationResponseSchema, dependencies=[Depends(AuthorizedUser())])
async def create_invitation(
    data: CreateSchema = Body(description='Invitation data'),
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Create new user invitation.
    """
    invitation_record = await invitation_manager.create(
        user=user,
        invitee_email=data.email,
        expiration_period=data.expiration_period
    )
    await invitation_manager.send_email(invitation_record)

    return invitation_record


@router.get('/list', response_model=list[InvitationResponseSchema], dependencies=[Depends(AuthorizedUser())])
async def list_invitations(
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Lists organization's user invitations.
    """
    return await invitation_manager.list_invitations(user.organization)


@router.delete(
    '/{invitation_id}',
    response_model=list[InvitationResponseSchema],
    dependencies=[Depends(AuthorizedUser())]
)
async def delete_invitaion(
    invitation_id: UUID = Path(title='The ID user invitation.'),
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Deletes invitation.
    """
    invitation_record = await invitation_manager.get_invitation(user.organization, invitation_id)
    await invitation_manager.delete_invitation(invitation_record)

    return await invitation_manager.list_invitations(user.organization)


@router.post('/{invitation_id}/send-email', dependencies=[Depends(AuthorizedUser())])
async def send_invitation_email(
    invitation_id: UUID = Path(title='The ID user invitation.'),
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Sends invitation email.
    """
    invitation_record = await invitation_manager.get_invitation(user.organization, invitation_id)
    await invitation_manager.send_email(invitation_record)


@router.get('/{invitation_id}/invitation-link', response_model=str, dependencies=[Depends(AuthorizedUser())])
async def get_user_invitation_link(
    invitation_id: UUID = Path(title='The ID user invitation.'),
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Returns user invitation link.
    """
    invitation_record = await invitation_manager.get_invitation(user.organization, invitation_id)
    link = invitation_manager.get_invitation_link(invitation_record)

    return link
