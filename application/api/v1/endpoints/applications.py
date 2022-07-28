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
from ..schemas.applications import InstallRequestBodySchema


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


@router.delete('/{application_id}')
async def uninstall_application(
    application_id: int = Path(title='The ID of the application to terminate'),
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager),
):
    """
    Uninstalls application.
    """
    await application_manager.terminate(application_id, user.organization)


@router.get('/list', response_model=list[ApplicationResponseSchema])
async def list_applications(
    user: User = Depends(current_active_user),
    application_manager: ApplicationManager = Depends(get_application_manager)
):
    """
    Returns list of organization's applications.
    """
    return await application_manager.list_applications(user.organization)
