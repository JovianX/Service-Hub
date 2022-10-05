from uuid import UUID

from fastapi import Depends
from fastapi import Path

from constants.roles import Roles
from core.authentication import current_active_user
from core.fastapi import RoleAPIRouter
from managers.users import UserManager
from managers.users import get_user_manager
from models.user import User
from schemas.users import UserUpdate

from ..schemas.common import UserResponseSchema


router = RoleAPIRouter()


@router.get('/me', response_model=UserResponseSchema, roles=[Roles.operator])
async def get_current_user(user: User = Depends(current_active_user)):
    """
    Returns current user information.
    """
    return user


@router.get('/list', response_model=list[UserResponseSchema])
async def list_organization_users(
    user: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager)
):
    """
    Returns organization's user list.
    """
    return await user_manager.organization_users(user.organization)


@router.post('/{user_id}/deactivate')
async def deactivate_user(
    user_id: UUID = Path(title='The ID of the user to deactivate'),
    user: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager)
):
    """
    Deactivates organization's user.
    """
    user_record = await user_manager.get(user_id)
    if user_record.is_active and user_record.organization.id == user.organization.id:
        await user_manager.update(user_update=UserUpdate(is_active=False), user=user_record, safe=False)


@router.post('/{user_id}/activate')
async def activate_user(
    user_id: UUID = Path(title='The ID of the user to activate'),
    user: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager)
):
    """
    Activates organization's user.
    """
    user_record = await user_manager.get(user_id)
    if not user_record.is_active and user_record.organization.id == user.organization.id:
        await user_manager.update(user_update=UserUpdate(is_active=True), user=user_record, safe=False)


@router.delete('/{user_id}')
async def delete_user(
    user_id: UUID = Path(title='The ID of the user to delete'),
    user: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager)
):
    """
    Deletes organization's user.
    """
    user_record = await user_manager.get(user_id)
    if user_record.organization.id == user.organization.id:
        await user_manager.delete(user_record)
