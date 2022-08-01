"""
Application endpoints.
"""
from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path

from application.core.authentication import current_active_user
from application.managers.applications import ApplicationManager
from application.managers.applications import get_application_manager
from application.managers.templates import TemplateManager
from application.managers.templates import get_template_manager
from application.models.user import User

from ..schemas.applications import ApplicationInstallResponseSchema
from ..schemas.applications import ApplicationResponseSchema
from ..schemas.applications import ApplicationUpgradeResponseSchema
from ..schemas.applications import InstallRequestBodySchema
from ..schemas.applications import UpdateRequestSchema
from ..schemas.applications import UpgradeRequestSchema


router = APIRouter()


@router.post('/install', response_model=ApplicationInstallResponseSchema)
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
    template_manager.validate_inputs(template, body.inputs)
    return await application_manager.install(
        context_name=body.context_name,
        namespace=body.namespace,
        user=user,
        template=template,
        inputs=body.inputs,
        dry_run=body.dry_run
    )


@router.patch('/{application_id}/update', response_model=dict[str, dict])
async def update_application(
    application_id: int = Path(title='The ID of the application to update'),
    body: UpdateRequestSchema = Body(description="Application release's update parameters"),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager),
):
    """
    Updates application's values of Helm releases.
    """
    application = await application_manager.get_organization_application(application_id, user.organization)

    return await application_manager.update(application, body.values, body.dry_run)


@router.post('/{application_id}/upgrade', response_model=ApplicationUpgradeResponseSchema)
async def upgrade_application(
    application_id: int = Path(title='The ID of the application to upgrade'),
    body: UpgradeRequestSchema = Body(description="Application upgrage parameters"),
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


@router.delete('/{application_id}')
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


@router.get('/list', response_model=list[ApplicationResponseSchema])
async def list_applications(
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager)
):
    """
    Returns list of organization's applications.
    """
    return await application_manager.list_applications(user.organization)
