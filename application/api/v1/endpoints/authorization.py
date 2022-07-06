from fastapi import APIRouter

from application.core.authentication import auth_backend
from application.core.authentication import fastapi_users
from application.core.authentication import github_client
from application.core.authentication import google_client
from application.core.configuration import settings
from application.schemas.users import UserCreate
from application.schemas.users import UserRead


router = APIRouter()


router.include_router(fastapi_users.get_auth_router(auth_backend), prefix='/jwt')

router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))

router.include_router(fastapi_users.get_reset_password_router())

router.include_router(fastapi_users.get_verify_router(UserRead))

google_router = fastapi_users.get_oauth_router(google_client, auth_backend, settings.SECRET)
router.include_router(google_router, prefix='/google')

github_router = fastapi_users.get_oauth_router(
    github_client,
    auth_backend,
    settings.SECRET,
    redirect_url='http://localhost:3000/sign-in')
router.include_router(github_router, prefix='/github')
