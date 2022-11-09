from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path
from fastapi import Query

from core.authentication import AuthorizedUser
from core.authentication import OperatorRolePermission
from core.authentication import current_active_user
from managers.helm.manager import HelmManager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from models.user import User

from ..schemas.helm import AddHelmRepositoryBodySchema
from ..schemas.helm import ChartDumpResponseSchema
from ..schemas.helm import ChartListItemSchema
from ..schemas.helm import InstallChartBodySchema
from ..schemas.helm import ReleaseHealthStatusResponseBodySchema
from ..schemas.helm import ReleaseListItemSchema
from ..schemas.helm import ReleaseTTLResponseSchema
from ..schemas.helm import ReleaseUpdateRequestSchema
from ..schemas.helm import SetReleaseTTLRequestSchema


router = APIRouter()


################################################################################
# Repositories
################################################################################

@router.post('/repository/add', dependencies=[Depends(AuthorizedUser())])
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


@router.get('/repository/list', dependencies=[Depends(AuthorizedUser(OperatorRolePermission))])
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


@router.delete('/repository/{repository_name}', dependencies=[Depends(AuthorizedUser())])
async def delete_repository(
    repository_name: str = Path(description='Name of Helm repository to delete', example='nginx-stable'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Removes Helm repository.
    """
    helm_manager = HelmManager(organization_manager)
    await helm_manager.delete_repository(user.organization, repository_name)


################################################################################
# Charts
################################################################################


@router.get(
    '/chart/list',
    response_model=list[ChartListItemSchema],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/chart/versions',
    response_model=list[ChartListItemSchema],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def list_chart_versions(
    chart_name: str = Query(description='Name of chart to search versions.'),
    include_development_versions: bool | None = Query(description='Should unstable versions be included in results.',
                                                      default=False),
    version_filter: str | None = Query(description='Chart version filter.'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List chart's versions.
    """
    helm_manager = HelmManager(organization_manager)
    charts = await helm_manager.list_chart_versions(
        user.organization,
        chart_name=chart_name,
        include_unstable=include_development_versions,
        version_filter=version_filter
    )

    return charts


@router.get(
    '/chart/default-values',
    response_model=str,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def get_chart_default_values(
    chart_name: str = Query(description='Chart name in format `<repository-name>/<application name>`.'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns default chart values(content of values.yaml file).
    """
    helm_manager = HelmManager(organization_manager)
    values_file_content = await helm_manager.chart_defaults(user.organization, chart_name)

    return values_file_content


@router.get('/chart/available', response_model=list[ChartListItemSchema], dependencies=[Depends(AuthorizedUser())])
async def list_available_for_application_charts(
    application_name: str = Query(description='Name of application for which chart requested'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List charts available charts for given application.
    """
    helm_manager = HelmManager(organization_manager)
    charts = await helm_manager.list_available_charts(user.organization, application_name)

    return charts


@router.post('/chart/install', dependencies=[Depends(AuthorizedUser())])
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
        version=data.version,
        values=data.values,
        description=data.description,
        dry_run=data.dry_run
    )


################################################################################
# Releases
################################################################################


@router.get(
    '/release/list',
    response_model=list[ReleaseListItemSchema],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/release/{release_name}/health-status',
    response_model=ReleaseHealthStatusResponseBodySchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/release/{release_name}/user-supplied-values',
    response_model=dict | list | None,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/release/{release_name}/computed-values',
    response_model=dict | list | None,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/release/{release_name}/detailed-hooks',
    response_model=list[dict],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/release/{release_name}/detailed-manifest',
    response_model=list[dict],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/release/{release_name}/notes',
    response_model=str,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
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


@router.get(
    '/release/{release_name}/dump-chart',
    response_model=ChartDumpResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def create_release_chart(
    release_name: str = Path(description='Name of target release'),
    context_name: str = Query(title='Name of context where release located'),
    namespase: str = Query(title='Name of namespace where release located'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Creates chart for release.
    """
    helm_manager = HelmManager(organization_manager)
    return await helm_manager.get_release_chart(user.organization, context_name, namespase, release_name)


@router.patch(
    '/release/{release_name}',
    response_model=dict,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def update_release(
    release_name: str = Path(description='Name of relase to get details'),
    body: ReleaseUpdateRequestSchema = Body(description='Release update parameters'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Updates release's values.
    """
    helm_manager = HelmManager(organization_manager)
    return await helm_manager.update_release(
        organization=user.organization,
        context_name=body.context_name,
        namespace=body.namespase,
        release_name=release_name,
        chart=body.chart_name,
        values=body.values,
        dry_run=body.dry_run
    )


@router.delete('/release/{release_name}', dependencies=[Depends(AuthorizedUser(OperatorRolePermission))])
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


@router.post('/release/{release_name}/ttl', dependencies=[Depends(AuthorizedUser(OperatorRolePermission))])
async def set_release_ttl(
    release_name: str = Path(description='Name of relase to set TTL'),
    data: SetReleaseTTLRequestSchema = Body(description='Release TTL data'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Sets release TTL(time to live).
    """
    helm_manager = HelmManager(organization_manager)
    await helm_manager.set_release_ttl(
        user.organization, context_name=data.context_name, namespace=data.namespase, release_name=release_name,
        minutes=data.minutes
    )


@router.get(
    '/release/{release_name}/ttl',
    response_model=ReleaseTTLResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def get_release_ttl(
    release_name: str = Path(description='Name of relase to get TTL'),
    context_name: str = Query(title='Name of context where release is located'),
    namespase: str = Query(title='Name of namespace where release is located'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns date when release scheduled for removal.
    """
    helm_manager = HelmManager(organization_manager)
    release_scheduled_removal_date = await helm_manager.read_release_ttl(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )

    return {'scheduled_time': release_scheduled_removal_date}


@router.delete('/release/{release_name}/ttl', dependencies=[Depends(AuthorizedUser(OperatorRolePermission))])
async def unset_release_ttl(
    release_name: str = Path(description='Name of relase to remove TTL'),
    context_name: str = Query(title='Name of context where release is located'),
    namespase: str = Query(title='Name of namespace where release is located'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Removes release TTL.
    """
    helm_manager = HelmManager(organization_manager)
    await helm_manager.delete_release_ttl(
        user.organization, context_name=context_name, namespace=namespase, release_name=release_name
    )
