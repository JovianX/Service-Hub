"""
Invitations related API endpoints.
"""
import logging
from uuid import UUID

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path
from fastapi import Request

from core.authentication import current_active_user
from managers.invitations import InvitationManager
from managers.invitations import get_invitation_manager
from managers.users import UserManager
from managers.users import get_user_manager
from models.user import User
from utils.email import send_email

from ..schemas.invitations import CreateSchema
from ..schemas.invitations import InvitationResponseSchema
from ..schemas.invitations import UseSchema


logger = logging.getLogger(__name__)

router = APIRouter()


@router.post('/', response_model=InvitationResponseSchema)
async def create_invitation(
    request: Request,
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
    link = request.url_for('use_invitaion', invitation_id=invitation_record.id)
    await send_email(
        invitation_record.email,
        f'You have been invited to join "{user.organization.title}" organization!',
        f'To join organization click following link: {link}'
    )

    return invitation_record


@router.get('/list', response_model=list[InvitationResponseSchema])
async def list_invitations(
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Lists organization's user invitations.
    """
    return await invitation_manager.list_invitations(user.organization)


@router.post('/{invitation_id}')
async def use_invitaion(
    invitation_id: UUID = Path(title='The ID user invitation.'),
    data: UseSchema = Body(description='User creation data'),
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Creates new user that used invitation.
    """
    invitation_record = await invitation_manager.get_invitation(user.organization, invitation_id)
    # TODO: !!!create user!!!
    await invitation_manager.use(invitation_record)


@router.delete('/{invitation_id}', response_model=list[InvitationResponseSchema])
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
