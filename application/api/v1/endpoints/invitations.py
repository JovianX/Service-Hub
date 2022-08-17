"""
Invitations related API endpoints.
"""
import logging
from uuid import UUID

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path

from core.authentication import current_active_user
from managers.invitations import InvitationManager
from managers.invitations import get_invitation_manager
from managers.users import UserManager
from managers.users import get_user_manager
from models.user import User
from schemas.users import UserCreate
from utils.email import send_email

from ..schemas.invitations import CreateSchema
from ..schemas.invitations import InvitationResponseSchema
from ..schemas.invitations import UseSchema


logger = logging.getLogger(__name__)

router = APIRouter()


@router.post('/', response_model=InvitationResponseSchema)
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


@router.get('/list', response_model=list[InvitationResponseSchema])
async def list_invitations(
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager)
):
    """
    Lists organization's user invitations.
    """
    return await invitation_manager.list_invitations(user.organization)


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


@router.post('/{invitation_id}/use')
async def use_invitaion(
    invitation_id: UUID = Path(title='The ID user invitation.'),
    data: UseSchema = Body(description='User creation data'),
    user: User = Depends(current_active_user),
    invitation_manager: InvitationManager = Depends(get_invitation_manager),
    user_manager: UserManager = Depends(get_user_manager)
):
    """
    Creates new user that used invitation.
    """
    invitation_record = await invitation_manager.get_invitation(user.organization, invitation_id)
    invitation_manager.is_valid(invitation_record)
    new_user = UserCreate(
        email=invitation_record.email,
        password=data.password,
        is_verified=True,
        organization_id=invitation_record.organization.id
    )
    new_user_record = await user_manager.create(new_user)
    await invitation_manager.use(invitation_record, new_user_record)


@router.post('/{invitation_id}/send-email')
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
