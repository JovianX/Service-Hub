from fastapi import APIRouter

from core.authentication import jwt_backend
from core.authentication import fastapi_users
from core.authentication import github_client
from core.authentication import google_client
from core.configuration import settings
from schemas.users import UserCreate
from schemas.users import UserRead


router = APIRouter()


router.include_router(fastapi_users.get_auth_router(jwt_backend), prefix='/jwt')

router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))

router.include_router(fastapi_users.get_reset_password_router())

router.include_router(fastapi_users.get_verify_router(UserRead))

google_router = fastapi_users.get_oauth_router(google_client, jwt_backend, settings.SECRET)
router.include_router(google_router, prefix='/google')

github_router = fastapi_users.get_oauth_router(
    github_client,
    jwt_backend,
    settings.SECRET,
    redirect_url=f'{settings.UI_HOST}/sign-in'
)
router.include_router(github_router, prefix='/github')
