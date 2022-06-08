from application.core.authentication import fastapi_users
from application.schemas.users import UserRead
from application.schemas.users import UserUpdate
from fastapi import APIRouter


router = APIRouter()


router.include_router(fastapi_users.get_users_router(UserRead, UserUpdate))
