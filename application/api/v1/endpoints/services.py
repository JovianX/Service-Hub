from typing import List

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path

from constants.services import ServiceHealthStatuses
from core.authentication import current_active_user
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from managers.services.manager import ServiceManager
from managers.services.manager import get_service_manager
from models.user import User

from ..schemas.services import CreateServiceBodySchema
from ..schemas.services import ServiceResponseSchema
from ..schemas.services import UpdateServiceSchema


router = APIRouter()


@router.post('/', response_model=ServiceResponseSchema)
async def create_service(
    body: CreateServiceBodySchema = Body(description='Service create request body'),
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Creates service catalog item.
    """
    return await service_manager.create_service(
        creator=user,
        type=body.type,
        name=body.name,
        settings=body.health_check_settings.dict(exclude_unset=True),
        description=body.description
    )


@router.get('/list', response_model=List[ServiceResponseSchema])
async def service_list(
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Creates service catalog item.
    """
    return await service_manager.list_organization_service(user.organization)


@router.patch('/{service_id}', response_model=ServiceResponseSchema)
async def update_service(
    service_id: int = Path(title='The ID of the service to update'),
    body: UpdateServiceSchema = Body(description='Service update request body'),
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Updates service instance.
    """
    return await service_manager.update_service(service_id, user.organization, body.dict(exclude_unset=True))


@router.delete('/{service_id}', response_model=List[ServiceResponseSchema])
async def delete_service(
    service_id: int = Path(title='The ID of the service to delete'),
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Deletes service catalog item.
    """
    await service_manager.delete_service(service_id, user.organization)
    return await service_manager.list_organization_service(user.organization)


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
