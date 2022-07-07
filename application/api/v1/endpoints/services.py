from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Path

from application.constants.services import ServiceHealthStatuses
from application.core.authentication import current_active_user
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.managers.services.manager import ServiceManager
from application.managers.services.manager import get_service_manager
from application.models.user import User

from ..schemas.services import CreateServiceBodySchema
from ..schemas.services import ServiceSchema


router = APIRouter()


@router.post('/')
async def create_service(
    body: CreateServiceBodySchema,
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Creates service catalog item.
    """
    await service_manager.create_service(
        creator=user,
        type=body.type,
        name=body.name,
        settings=body.health_check_settings.dict(exclude_unset=True),
        description=body.description
    )


@router.get('/list', response_model=List[ServiceSchema])
async def service_list(
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Creates service catalog item.
    """
    organization = user.organization
    return await service_manager.list_organization_service(organization)


@router.delete('/{service_id}')
async def delete_service(
    service_id: int = Path(title='The ID of the service to delete'),
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Deletes service catalog item.
    """
    await service_manager.delete_service(service_id, user.organization)


@router.get('/{service_id}/check-health', response_model=ServiceHealthStatuses)
async def check_service_health_status(
    service_id: int = Path(title='The ID of the service to check heath'),
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Checks service health status.
    """
    return await service_manager.check_health(service_id, user.organization, organization_manager)
