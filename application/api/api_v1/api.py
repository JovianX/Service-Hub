from fastapi import APIRouter

from .endpoints import authorization
from .endpoints import users


router = APIRouter()


router.include_router(authorization.router, prefix='/auth', tags=['auth'])

router.include_router(users.router, prefix='/users', tags=['users'])
