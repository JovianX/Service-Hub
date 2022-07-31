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

from ..schemas.applications import InstallRequestBodySchema


router = APIRouter()


@router.post('/install')
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
