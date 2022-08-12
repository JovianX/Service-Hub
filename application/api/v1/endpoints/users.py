from fastapi import APIRouter

from core.authentication import fastapi_users
from schemas.users import UserRead
from schemas.users import UserUpdate


router = APIRouter()


router.include_router(fastapi_users.get_users_router(UserRead, UserUpdate))
