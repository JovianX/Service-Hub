"""
Application endpoints.
"""
from datetime import timedelta

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path

from constants.applications import ApplicationHealthStatuses
from core.authentication import AuthorizedUser
from core.authentication import OperatorRolePermission
from core.authentication import current_active_user
from managers.applications import ApplicationManager
from managers.applications import get_application_manager
from managers.templates import TemplateManager
from managers.templates import get_template_manager
from models.user import User
from schemas.templates.outputs import Output
from utils.template import load_template

from ..schemas.applications import ApplicationInstallResponseSchema
from ..schemas.applications import ApplicationResponseSchema
from ..schemas.applications import ApplicationTTLSchema
from ..schemas.applications import ApplicationUpgradeResponseSchema
from ..schemas.applications import InstallRequestBodySchema
from ..schemas.applications import UpgradeRequestSchema
from ..schemas.applications import UserInputUpdateRequestSchema


router = APIRouter()


@router.post(
    '/install',
    response_model=ApplicationInstallResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def install_application(
    body: InstallRequestBodySchema = Body(description='Application installation data'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager),
    template_manager: TemplateManager = Depends(get_template_manager)
):
    """
    Installs application from given template.
    """
    template = await template_manager.get_organization_template(
        template_id=body.template_id,
        organization=user.organization
    )
    install_result = await application_manager.install(
        context_name=body.context_name,
        namespace=body.namespace,
        user=user,
        template=template,
        inputs=body.inputs,
        dry_run=body.dry_run
    )
    if body.dry_run:
        return {
            'application': None,
            'results': install_result
        }
    else:
        if body.ttl:
            delta = timedelta(hours=body.ttl.hours)
            await application_manager.set_ttl(install_result, delta)
        return {
            'application': install_result,
            'results': {}
        }


@router.get(
    '/list',
    response_model=list[ApplicationResponseSchema],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def list_applications(
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager)
):
    """
    Returns list of organization's applications.
    """
    return await application_manager.list_applications(user.organization)


@router.get(
    '/{application_id}/health',
    response_model=ApplicationHealthStatuses,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def get_application_health_status(
    application_id: int = Path(title='The ID of the application to check'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager)
):
    """
    Returns application health condition.
    """
    application = await application_manager.get_organization_application(application_id, user.organization)
    condition = await application_manager.get_application_health_condition(application)

    return condition['status']


@router.get(
    '/{application_id}/outputs',
    response_model=Output,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def get_application_outputs(
    application_id: int = Path(title='The ID of the application.'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager)
):
    """
    Returns application outputs that must be shown to user.
    """
    application = await application_manager.get_organization_application(application_id, user.organization)
    components_manifests = await application_manager.get_component_manifests(application)
    raw_manifest = application_manager.render_manifest(
        application.template,
        application=application,
        components_manifests=components_manifests
    )
    manifet = load_template(raw_manifest)

    return manifet.output

@router.post(
    '/{application_id}/upgrade',
    response_model=ApplicationUpgradeResponseSchema | None,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def upgrade_application(
    application_id: int = Path(title='The ID of the application to upgrade'),
    body: UpgradeRequestSchema = Body(description='Application upgrage parameters'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager),
    template_manager: TemplateManager = Depends(get_template_manager)
):
    """
    Upgrades application manifest to given template.
    """
    template = await template_manager.get_organization_template(
        template_id=body.template_id,
        organization=user.organization
    )
    application = await application_manager.get_organization_application(application_id, user.organization)

    return await application_manager.upgrade(application, template, body.dry_run)


@router.post(
    '/{application_id}/user-inputs',
    response_model=dict,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def update_user_inputs(
    application_id: int = Path(title='The ID of the application'),
    body: UserInputUpdateRequestSchema = Body(description='User inputs'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager),
):
    """
    Rerenders template with new user inputs.
    """
    application = await application_manager.get_organization_application(application_id, user.organization)

    return await application_manager.update_user_inputs(application, body.inputs, body.dry_run)


@router.post(
    '/{application_id}/ttl',
    response_model=ApplicationResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def set_application_ttl(
    application_id: int = Path(title='The ID of the application.'),
    body: ApplicationTTLSchema = Body(description='Application deadline parameters.'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager),
):
    """
    Sets application deadline reaching which application will be deleted(TTL - time to live).
    """
    application = await application_manager.get_organization_application(application_id, user.organization)
    delta = timedelta(hours=body.hours)

    await application_manager.set_ttl(application, delta)

    return application


@router.delete('/{application_id}', dependencies=[Depends(AuthorizedUser(OperatorRolePermission))])
async def uninstall_application(
    application_id: int = Path(title='The ID of the application to terminate'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager),
):
    """
    Uninstalls application.
    """
    application = await application_manager.get_organization_application(application_id, user.organization)
    await application_manager.terminate(application)
