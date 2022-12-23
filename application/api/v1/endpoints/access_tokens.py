"""
User access tokens related API endpoints.
"""
import logging
from uuid import UUID

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path

from core.authentication import AuthorizedUser
from core.authentication import OperatorRolePermission
from core.authentication import current_active_user
from managers.access_tokens import AccessTokenManager
from managers.access_tokens import get_access_token_manager
from managers.users import UserManager
from managers.users import get_user_manager
from models.user import User

from ..schemas.access_tokens import AccessTokenResponseSchema
from ..schemas.access_tokens import CreateSchema
from ..schemas.access_tokens import SetCommentSchema
from ..schemas.access_tokens import SetExpirationDateSchema
from ..schemas.access_tokens import SetStatusSchema


logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    '/',
    response_model=AccessTokenResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def create_access_token(
    data: CreateSchema = Body(description='Access token create data.'),
    creator: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager),
    token_manager: AccessTokenManager = Depends(get_access_token_manager)
):
    """
    Create new user access token.
    """
    user = await user_manager.get(data.user)
    token = await token_manager.create(
        creator=creator,
        user=user,
        comment=data.comment,
        expiration_date=data.expiration_date
    )

    return token


@router.get(
    '/list',
    response_model=list[AccessTokenResponseSchema],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def list_access_tokens(
    user: User = Depends(current_active_user),
    token_manager: AccessTokenManager = Depends(get_access_token_manager)
):
    """
    Returns list of organization's user access tokens.
    """
    return await token_manager.list_organization_access_tokens(user.organization)


@router.post(
    '/{token}/expiration-date',
    response_model=AccessTokenResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def set_access_token_expiration_date(
    token: UUID = Path(title='Token to change.'),
    body: SetExpirationDateSchema = Body(description='Access token expiration date body.'),
    user: User = Depends(current_active_user),
    token_manager: AccessTokenManager = Depends(get_access_token_manager)
):
    """
    Sets user access token expiration date.
    """
    token_record = await token_manager.get_access_token(user.organization, token)
    await token_manager.set_expiration_date(token_record, body.expiration_date)

    return token_record


@router.post(
    '/{token}/comment',
    response_model=AccessTokenResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def set_access_token_comment(
    token: UUID = Path(title='Token to change.'),
    body: SetCommentSchema = Body(description='Access token comment body.'),
    user: User = Depends(current_active_user),
    token_manager: AccessTokenManager = Depends(get_access_token_manager)
):
    """
    Sets user access token comment.
    """
    token_record = await token_manager.get_access_token(user.organization, token)
    await token_manager.set_comment(token_record, body.comment)

    return token_record


@router.post(
    '/{token}/status',
    response_model=AccessTokenResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def set_access_token_status(
    token: UUID = Path(title='Token to change.'),
    body: SetStatusSchema = Body(description='Access token status body.'),
    user: User = Depends(current_active_user),
    token_manager: AccessTokenManager = Depends(get_access_token_manager)
):
    """
    Sets user access token status.
    """
    token_record = await token_manager.get_access_token(user.organization, token)
    await token_manager.set_status(token_record, body.status)

    return token_record


@router.delete(
    '/{token}',
    response_model=list[AccessTokenResponseSchema],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def delete_access_token(
    token: UUID = Path(title='Token to remove.'),
    user: User = Depends(current_active_user),
    token_manager: AccessTokenManager = Depends(get_access_token_manager)
):
    """
    Deletes organization's user access token.
    """
    token_record = await token_manager.get_access_token(user.organization, token)
    await token_manager.delete_access_token(token_record, user)

    return await token_manager.list_organization_access_tokens(user.organization)
