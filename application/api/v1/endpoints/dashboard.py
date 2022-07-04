"""
Dashboard endpoints.
"""
from fastapi import APIRouter
from fastapi import Depends

from application.core.authentication import current_active_user
from application.managers.helm.manager import HelmManager
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.models.user import User


router = APIRouter()


@router.get('/release-count', response_model=int)
async def get_releases_count(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns count of Helm releases.
    """
    helm_manager = HelmManager(organization_manager)
    return await helm_manager.releases_count(user.organization)


@router.get('/repository-count', response_model=int)
async def get_repository_count(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns count of Helm repositories.
    """
    helm_manager = HelmManager(organization_manager)
    return len(await helm_manager.list_repositories(user.organization))


@router.get('/chart-count', response_model=int)
async def get_charts_count(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns count of all charts in all repositories.
    """
    helm_manager = HelmManager(organization_manager)

    return len(await helm_manager.list_repositories_charts(user.organization))


@router.get('/context-count', response_model=int)
async def get_context_count(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns count of contextes in organization's Kubernetes configuration.
    """
    configuration = organization_manager.get_kubernetes_configuration(user.organization)

    return len(configuration.contexts)
