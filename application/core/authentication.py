import uuid
from typing import Optional

from fastapi import Depends
from fastapi import Request
from fastapi_users import BaseUserManager
from fastapi_users import FastAPIUsers
from fastapi_users import UUIDIDMixin
from fastapi_users import exceptions
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication import BearerTransport
from fastapi_users.authentication import JWTStrategy
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users.password import PasswordHelperProtocol
from httpx_oauth.clients.google import GoogleOAuth2

from ..core.configuration import settings
from ..db.session import get_session
from ..managers.organizations.manager import OrganizationManager
from ..managers.organizations.manager import get_organization_manager
from ..models.user import OAuthAccount
from ..models.user import User
from ..schemas.users import UserCreate


google_client = GoogleOAuth2(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET)
bearer_transport = BearerTransport(tokenUrl='api/v1/auth/jwt/login')


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.SECRET
    verification_token_secret = settings.SECRET

    def __init__(self, user_db: SQLAlchemyUserDatabase, organizations: OrganizationManager):
        self.organizations = organizations
        super().__init__(user_db)

    async def create(self, user_create: UserCreate, safe: bool = False, request: Optional[Request] = None) -> User:
        """
        Create a user in database.

        Triggers the on_after_register handler on success.

        :param user_create: The UserCreate model to create.
        :param safe: If True, sensitive values like is_superuser or is_verified
        will be ignored during the creation, defaults to False.
        :param request: Optional FastAPI request that
        triggered the operation, defaults to None.
        :raises UserAlreadyExists: A user already exists with the same e-mail.
        :return: A new user.
        """
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop('password')
        user_dict['hashed_password'] = self.password_helper.hash(password)

        organization = await self.organizations.create()
        user_dict['organization_id'] = organization.id
        created_user = await self.user_db.create(user_dict)

        await self.on_after_register(created_user, request)

        return created_user

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f'User {user.id} has registered.')

    async def on_after_forgot_password(self, user: User, token: str, request: Optional[Request] = None):
        print(f'User {user.id} has forgot their password. Reset token: {token}')

    async def on_after_request_verify(self, user: User, token: str, request: Optional[Request] = None):
        print(f'Verification requested for user {user.id}. Verification token: {token}')


async def get_user_db(session=Depends(get_session)):
    yield SQLAlchemyUserDatabase(session, User, OAuthAccount)


async def get_user_manager(user_db=Depends(get_user_db), organization_manager=Depends(get_organization_manager)):
    yield UserManager(user_db, organization_manager)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name='jwt',
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)
