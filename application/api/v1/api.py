from fastapi import APIRouter

from .endpoints import access_tokens
from .endpoints import applications
from .endpoints import authorization
from .endpoints import dashboard
from .endpoints import events
from .endpoints import helm
from .endpoints import invitations
from .endpoints import kubernetes
from .endpoints import organizations
from .endpoints import rules
from .endpoints import services
from .endpoints import templates
from .endpoints import users


router = APIRouter()


router.include_router(access_tokens.router, prefix='/access-token', tags=['access tokens'])

router.include_router(applications.router, prefix='/application', tags=['applications'])

router.include_router(authorization.router, prefix='/auth', tags=['auth'])

router.include_router(dashboard.router, prefix='/dashboard', tags=['dashboard'])

router.include_router(events.router, prefix='/event', tags=['events'])

router.include_router(helm.router, prefix='/helm', tags=['helm'])

router.include_router(invitations.router, prefix='/invitation', tags=['invitations'])

router.include_router(kubernetes.router, prefix='/kubernetes', tags=['kubernetes'])

router.include_router(organizations.router, prefix='/organization', tags=['organizations'])

router.include_router(rules.router, prefix='/rule', tags=['rules'])

router.include_router(services.router, prefix='/service', tags=['services'])

router.include_router(templates.router, prefix='/template', tags=['templates'])

router.include_router(users.router, prefix='/user', tags=['users'])
