"""
Dashboard endpoints.
"""
import asyncio

from fastapi import APIRouter
from fastapi import Depends

from constants.helm import ReleaseHealthStatuses
from core.authentication import current_active_user
from managers.helm.manager import HelmManager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from managers.services.manager import ServiceManager
from managers.services.manager import get_service_manager
from models.user import User


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


@router.get('/unhealthy-count', response_model=int)
async def get_unhealthy_releases_count(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns count of unhealthy releases.
    """
    unhealthy_releases_count = 0
    helm_manager = HelmManager(organization_manager)
    releases = await helm_manager.list_releases(user.organization)

    health_statuses = await asyncio.gather(*[
        helm_manager.release_health_status(
            user.organization,
            release['context_name'],
            release['namespace'],
            release['name']
        )
        for release in releases
    ])
    for status in health_statuses:
        if status['status'] == ReleaseHealthStatuses.unhealthy:
            unhealthy_releases_count += 1

    return unhealthy_releases_count


@router.get('/services-count', response_model=int)
async def get_services_count(
    user: User = Depends(current_active_user),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """
    Returns count of services in service catalog.
    """
    organization = user.organization
    services = await service_manager.list_organization_service(organization)

    return len(services)
