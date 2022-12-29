import re
import uuid
from datetime import datetime

import jwt
from fastapi import Request
from fastapi import status
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication import BearerTransport
from fastapi_users.authentication import JWTStrategy
from fastapi_users.authentication.strategy.base import Strategy
from fastapi_users.authentication.strategy.base import StrategyDestroyNotSupportedError
from fastapi_users.exceptions import InvalidID
from fastapi_users.exceptions import UserNotExists
from fastapi_users.jwt import decode_jwt
from fastapi_users.jwt import generate_jwt
from httpx_oauth.clients.github import GitHubOAuth2
from httpx_oauth.clients.google import GoogleOAuth2

from constants.access_tokens import AccessTokenStatuses
from constants.events import EventCategory
from constants.events import EventSeverityLevel
from constants.roles import Roles
from core.configuration import settings
from crud.access_tokens import AccessTokenDatabase
from db.session import session_maker
from exceptions.common import CommonException
from exceptions.db import RecordNotFoundException
from managers.users import UserManager
from managers.users import get_user_manager
from models.user import User
from schemas.events import EventSchema


JWT_PATTERN = re.compile(r'^(?:[\w-]*\.){2}[\w-]*$')


class CustomPayloadJWTStrategy(JWTStrategy):
    """
    Class to extend encoded in JWT token payload.
    """
    async def write_token(self, user: User) -> str:
        data = {
            'user_id': str(user.id),
            'user_role': user.role,
            'aud': self.token_audience
        }

        return generate_jwt(data, self.encode_key, self.lifetime_seconds, algorithm=self.algorithm)

    async def read_token(self, token: str | None, user_manager: UserManager) -> User | None:
        if token is None:
            return None
        try:
            data = self.extract_token_data(token)
        except jwt.PyJWTError:
            return None
        user_id = data.get('user_id')
        if user_id is None:
            return None

        try:
            parsed_id = user_manager.parse_id(user_id)
            return await user_manager.get(parsed_id)
        except (UserNotExists, InvalidID):
            return None

    def extract_token_data(self, token: str | None) -> dict | None:
        """
        Extracts encoded in token data.
        """
        return decode_jwt(token, self.decode_key, self.token_audience, algorithms=[self.algorithm])


class AccessTokenStrategy(Strategy):
    """
    Strategy to authenticate user by user's access token.
    """
    async def write_token(self, user: User) -> str:
        raise CommonException('Access token can not be created through common login flow.')

    async def read_token(self, token: str | None, user_manager: UserManager | None = None) -> User | None:
        if token is None:
            return

        async with session_maker() as session:
            access_token_db = AccessTokenDatabase(session)
            try:
                token_record = await access_token_db.get(id=token)
            except RecordNotFoundException:
                raise CommonException(f'Unknown access token {token}.', status_code=status.HTTP_401_UNAUTHORIZED)
        if token_record.status != AccessTokenStatuses.active:
            if user_manager is not None:
                await user_manager.event_manager.create(EventSchema(
                    organization_id=token_record.organization.id,
                    title='Invalid access token useded.',
                    message=f'Was used token that is not active.',
                    category=EventCategory.access_token,
                    severity=EventSeverityLevel.warning,
                    data={'token': str(token_record.id)}
                ))
            raise CommonException(f'Token is not usable.', status_code=status.HTTP_403_FORBIDDEN)
        if token_record.expiration_date is not None and token_record.expiration_date <= datetime.now():
            if user_manager is not None:
                await user_manager.event_manager.create(EventSchema(
                    organization_id=token_record.organization.id,
                    title='Expired access token useded.',
                    message=f'Was used token that reached end of its life time.',
                    category=EventCategory.access_token,
                    severity=EventSeverityLevel.warning,
                    data={'token': str(token_record.id)}
                ))
            raise CommonException(f'Token is expired.', status_code=status.HTTP_403_FORBIDDEN)
        if user_manager is not None:
            await user_manager.event_manager.create(EventSchema(
                organization_id=token_record.organization.id,
                title='Access token useded.',
                message=f'Access token useded access Service Hub.',
                category=EventCategory.access_token,
                data={'token': str(token_record.id)}
            ))

        return token_record.user

    async def destroy_token(self, token: str, user: User) -> None:
        raise StrategyDestroyNotSupportedError('Access token can not be deleted through common logout flow.')


github_client = GitHubOAuth2(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET, scopes=['user:email'])
google_client = GoogleOAuth2(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET)
bearer_transport = BearerTransport(tokenUrl='api/v1/auth/jwt/login')


def get_jwt_strategy() -> CustomPayloadJWTStrategy:
    return CustomPayloadJWTStrategy(secret=settings.SECRET, lifetime_seconds=settings.USER_SESSION_TTL)


jwt_backend = AuthenticationBackend(name='jwt', transport=bearer_transport, get_strategy=get_jwt_strategy,)


def get_access_token_strategy() -> AccessTokenStrategy:
    return AccessTokenStrategy()


access_token_backend = AuthenticationBackend(
    name='access-token',
    transport=bearer_transport,
    get_strategy=get_access_token_strategy
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [jwt_backend, access_token_backend])

current_active_user = fastapi_users.current_user(active=True)


class BasePermission:
    async def authorize(self, request: Request) -> bool:
        raise NotImplementedError()


class BaseRolePermission(BasePermission):
    @classmethod
    async def authorize(cls, request: Request) -> bool:
        authorization_header = request.headers.get('authorization')
        if not authorization_header:
            raise CommonException(
                '"Authorization" header is absent in request.',
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        token = authorization_header[7:]  # Cutting off "Bearer "
        if JWT_PATTERN.match(token):
            return cls._authorize_jwt(token)
        else:
            return await cls._authorize_access_token(token)

    @classmethod
    async def _authorize_access_token(cls, token: str) -> bool:
        strategy = get_access_token_strategy()
        user = await strategy.read_token(token)

        return user.role == cls.role

    @classmethod
    def _authorize_jwt(cls, token: str) -> bool:
        strategy = get_jwt_strategy()
        try:
            token_data = strategy.extract_token_data(token)
        except jwt.ExpiredSignatureError:
            raise CommonException('Expired JWT token.', status_code=status.HTTP_401_UNAUTHORIZED)
        user_role = token_data.get('user_role')
        if not user_role:
            raise CommonException('Unknown user role.', status_code=status.HTTP_401_UNAUTHORIZED)

        return user_role == cls.role

    @property
    def role(self):
        raise NotImplementedError('You must provide user role to authorize.')


class AdminRolePermission(BaseRolePermission):
    role = Roles.admin


class OperatorRolePermission(BaseRolePermission):
    role = Roles.operator


class AuthorizedUser:
    def __init__(self, *permissions: tuple[BasePermission]) -> None:
        self.permissions = permissions
        if AdminRolePermission not in self.permissions:
            self.permissions = (AdminRolePermission, *self.permissions)

    async def __call__(self, request: Request) -> None:
        for permission in self.permissions:
            if await permission.authorize(request=request):
                break
        else:
            raise CommonException(
                'You do not have permission to access to this functionality. Ask organization\'s administrator grant '
                'you permission.',
                status_code=status.HTTP_403_FORBIDDEN
            )
