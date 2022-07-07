from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from application.core.authentication import current_active_user
from application.managers.helm.manager import HelmManager
from application.managers.helm.schemas import ReleaseDetails
from application.managers.helm.schemas import ReleaseListItemSchema
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.models.user import User

from ..schemas.helm import AddHelmRepositoryBodySchema
from ..schemas.helm import InstallChartBodySchema


router = APIRouter()


@router.post('/repository/add')
async def add_repository(
    data: AddHelmRepositoryBodySchema,
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

    return repositories


@router.get('/chart/list')
async def list_charts_in_repsitories(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List all charts in all repositories.
    """
    helm_manager = HelmManager(organization_manager)
    charts = await helm_manager.list_repositories_charts(user.organization)

    return charts


@router.post('/chart/install')
async def install_chart(
    data: InstallChartBodySchema,
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Install Helm chart.
    """
    helm_manager = HelmManager(organization_manager)
    return await helm_manager.install_chart(
        user.organization,
        context_name=data.context_name,
        namespace=data.namespace,
        release_name=data.release_name,
        chart_name=data.chart_name,
        values=data.values,
        description=data.description
    )


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


@router.get('/release/details', response_model=ReleaseDetails)
async def release_details(
    context_name: str = Query(title='Name of context to use during data fetch'),
    namespase: str = Query(title='Name of namespace to use during data fetch'),
    release_name: str = Query(title='Name of relase to get details'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns details for given release such as user values, computed values,
    manifest, hooks and notes.
    """
    helm_manager = HelmManager(organization_manager)
    details = await helm_manager.release_details(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return details


@router.delete('/release')
async def delete_release(
    context_name: str = Query(title='Name of context where uninstalling release is located'),
    namespase: str = Query(title='Name of namespace where uninstalling release is located'),
    release_name: str = Query(title='Name of relase to uninstall'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Removes previously installed chart.
    """
    helm_manager = HelmManager(organization_manager)
    await helm_manager.uninstall_release(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )
