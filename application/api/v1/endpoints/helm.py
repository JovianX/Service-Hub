from fastapi import APIRouter
from fastapi import Depends
from fastapi import Path
from fastapi import Query

from application.core.authentication import current_active_user
from application.managers.helm.manager import HelmManager
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.models.user import User

from ..schemas.helm import AddHelmRepositoryBodySchema
from ..schemas.helm import ChartListItemSchema
from ..schemas.helm import InstallChartBodySchema
from ..schemas.helm import ReleaseHealthStatusResponseBodySchema
from ..schemas.helm import ReleaseListItemSchema


router = APIRouter()


################################################################################
# Repositories
################################################################################

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


################################################################################
# Charts
################################################################################


@router.get('/chart/list', response_model=list[ChartListItemSchema])
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


################################################################################
# Releases
################################################################################


@router.get('/release/list', response_model=list[ReleaseListItemSchema])
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


@router.get('/release/{release_name}/health-status', response_model=ReleaseHealthStatusResponseBodySchema)
async def release_health_status(
    release_name: str = Path(description='Name of relase to get details'),
    context_name: str = Query(title='Name of context to use during data fetch'),
    namespase: str = Query(title='Name of namespace to use during data fetch'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns health status details for given release entities.
    """
    helm_manager = HelmManager(organization_manager)
    health_details = await helm_manager.release_health_status(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return health_details


@router.get('/release/{release_name}/user-supplied-values', response_model=dict)
async def release_user_supplied_values(
    release_name: str = Path(description='Name of relase to get details'),
    context_name: str = Query(title='Name of context to use during data fetch'),
    namespase: str = Query(title='Name of namespace to use during data fetch'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns release values supplied by user during chart install.
    """
    helm_manager = HelmManager(organization_manager)
    user_supplied_values = await helm_manager.get_user_supplied_values(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return user_supplied_values


@router.get('/release/{release_name}/computed-values', response_model=dict)
async def release_computed_values(
    release_name: str = Path(description='Name of relase to get details'),
    context_name: str = Query(title='Name of context to use during data fetch'),
    namespase: str = Query(title='Name of namespace to use during data fetch'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns release final release values.
    """
    helm_manager = HelmManager(organization_manager)
    computed_values = await helm_manager.get_computed_values(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return computed_values


@router.get('/release/{release_name}/detailed-hooks', response_model=list[dict])
async def release_detailed_hooks(
    release_name: str = Path(description='Name of relase to get details'),
    context_name: str = Query(title='Name of context to use during data fetch'),
    namespase: str = Query(title='Name of namespace to use during data fetch'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns release hooks extended with details from Kubernetes.
    """
    helm_manager = HelmManager(organization_manager)
    detailed_hooks = await helm_manager.get_detailed_hooks(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return detailed_hooks


@router.get('/release/{release_name}/detailed-manifest', response_model=list[dict])
async def release_detailed_manifest(
    release_name: str = Path(description='Name of relase to get details'),
    context_name: str = Query(title='Name of context to use during data fetch'),
    namespase: str = Query(title='Name of namespace to use during data fetch'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns release manifest extended with details from Kubernetes.
    """
    helm_manager = HelmManager(organization_manager)
    detailed_manifest = await helm_manager.get_detailed_manifest(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return detailed_manifest


@router.get('/release/{release_name}/notes', response_model=str)
async def release_notes(
    release_name: str = Path(description='Name of relase to get details'),
    context_name: str = Query(title='Name of context to use during data fetch'),
    namespase: str = Query(title='Name of namespace to use during data fetch'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns release notes.
    """
    helm_manager = HelmManager(organization_manager)
    notes = await helm_manager.get_notes(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return notes


@router.delete('/release/{release_name}')
async def delete_release(
    release_name: str = Path(description='Name of relase to get details'),
    context_name: str = Query(title='Name of context where uninstalling release is located'),
    namespase: str = Query(title='Name of namespace where uninstalling release is located'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Uninstalls release.
    """
    helm_manager = HelmManager(organization_manager)
    await helm_manager.uninstall_release(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )
