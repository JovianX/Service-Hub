import uuid

import jwt
from fastapi import Depends
from fastapi import Request
from fastapi import status
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication import BearerTransport
from fastapi_users.authentication import JWTStrategy
from fastapi_users.exceptions import InvalidID
from fastapi_users.exceptions import UserNotExists
from fastapi_users.jwt import decode_jwt
from fastapi_users.jwt import generate_jwt
from httpx_oauth.clients.github import GitHubOAuth2
from httpx_oauth.clients.google import GoogleOAuth2

from constants.roles import Roles
from core.configuration import settings
from exceptions.common import CommonException
from managers.users import UserManager
from managers.users import get_user_manager
from models.user import User


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
        data = self.extract_token_data(token)
        if data is None:
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
        if token is None:
            return None

        try:
            data = decode_jwt(token, self.decode_key, self.token_audience, algorithms=[self.algorithm])
        except jwt.PyJWTError:
            return None

        return data


github_client = GitHubOAuth2(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET)
google_client = GoogleOAuth2(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET)
bearer_transport = BearerTransport(tokenUrl='api/v1/auth/jwt/login')


def get_jwt_strategy() -> CustomPayloadJWTStrategy:
    return CustomPayloadJWTStrategy(secret=settings.SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name='jwt',
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

active_user_authorizer = fastapi_users.current_user(active=True)


async def authorizate_user(request: Request, user: User = Depends(active_user_authorizer)):
    """
    Dependency to authorize authenticated user.
    """
    if user.role == Roles.admin:
        # This is superuser nothing to check here.
        return user

    jwt_strategy = get_jwt_strategy()
    route = request.scope['route']
    token = request.headers['authorization'][7:]
    token_data = jwt_strategy.extract_token_data(token) or {}
    if token_data.get('user_role') not in route.roles:
        raise CommonException(
            'You do not have permission to access to this functionality. Ask organization\'s administrator grant you '
            'permission.',
            status_code=status.HTTP_403_FORBIDDEN
        )

    return user

# current_active_user = fastapi_users.current_user(active=True)
current_active_user = authorizate_user
