from fastapi import APIRouter

from .endpoints import authorization
from .endpoints import helm
from .endpoints import organizations
from .endpoints import users


router = APIRouter()


router.include_router(authorization.router, prefix='/auth', tags=['auth'])

router.include_router(helm.router, prefix='/helm', tags=['kubernetes', 'helm'])

router.include_router(organizations.router, prefix='/organization', tags=['organizations'])

router.include_router(users.router, prefix='/users', tags=['users'])
