from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from application.core.authentication import current_active_user
from application.managers.helm.manager import HelmManager
from application.managers.helm.schemas import ReleaseListItemSchema
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.models.user import User
from application.schemas.helm import HelmRepositorySchema


router = APIRouter()


@router.post('/repository/add')
async def add_repository(
    data: HelmRepositorySchema,
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Add helm charts repository.
    """
    helm_manager = HelmManager(organization_manager)
    await helm_manager.add_repository(user.organization, data.name, data.url)


@router.get('/repository/list')
async def list_repository(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List all helm charts repositories.
    """
    helm_manager = HelmManager(organization_manager)
    repositories = await helm_manager.list_repositories(user.organization)

    return {'data': repositories}


@router.get('/chart/list')
async def list_charts_in_repsitories(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List all charts in all repositories.
    """
    helm_manager = HelmManager(organization_manager)
    repositories = await helm_manager.list_repositories_charts(user.organization)

    return {'data': repositories}


@router.get('/release/list', response_model=List[ReleaseListItemSchema])
async def list_releases(
    namespace: str | None = Query(default=None),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List releases in all namespaces using default context.
    """
    helm_manager = HelmManager(organization_manager)
    releases = await helm_manager.list_releases(user.organization, namespace=namespace)

    return releases
