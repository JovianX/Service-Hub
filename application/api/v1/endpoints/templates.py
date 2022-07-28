"""
Templates endpoints
"""
from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path

from application.core.authentication import current_active_user
from application.managers.templates.manager import TemplateManager
from application.managers.templates.manager import get_template_manager
from application.models.user import User

from ..schemas.templates import TemplateCreateBodySchema
from ..schemas.templates import TemplateResponseBodySchema
from ..schemas.templates import TemplateUpdateBodySchema


router = APIRouter()


@router.post('/', response_model=TemplateResponseBodySchema)
async def create_template_revision(
    template: TemplateCreateBodySchema = Body(description='Template create data'),
    user: User = Depends(current_active_user),
    template_manager: TemplateManager = Depends(get_template_manager)
):
    """
    Create new template revision.
    """
    created_template = await template_manager.create_template(
        creator=user,
        template=template.template,
        description=template.description,
        enabled=template.enabled
    )

    return created_template


@router.get('/list', response_model=list[TemplateResponseBodySchema])
async def list_organization_templates(
    user: User = Depends(current_active_user),
    template_manager: TemplateManager = Depends(get_template_manager)
):
    """
    Returns organization's templates.
    """
    return await template_manager.list_templates(organization=user.organization)


@router.patch('/{template_id}', response_model=TemplateResponseBodySchema)
async def update_template(
    template_id: int = Path(title='The ID of the template to update'),
    template_data: TemplateUpdateBodySchema = Body(description='Template update data'),
    user: User = Depends(current_active_user),
    template_manager: TemplateManager = Depends(get_template_manager)
):
    """
    Updates templates's attributes.
    """
    return await template_manager.update_template(
        template_id=template_id,
        organization=user.organization,
        template_data=template_data.dict(exclude_unset=True)
    )


@router.post('/{template_id}/make-default', response_model=TemplateResponseBodySchema)
async def make_template_default(
    template_id: int = Path(title='The ID of the template to make default'),
    user: User = Depends(current_active_user),
    template_manager: TemplateManager = Depends(get_template_manager)
):
    """
    Sets given template as default.
    """
    return await template_manager.make_template_default(template_id=template_id, organization=user.organization)


@router.delete('/{template_id}', response_model=list[TemplateResponseBodySchema])
async def delete_template(
    template_id: int = Path(title='The ID of the template to delete'),
    user: User = Depends(current_active_user),
    template_manager: TemplateManager = Depends(get_template_manager)
):
    """
    Deletes organization's template.
    """
    organization = user.organization
    await template_manager.delete_template(template_id=template_id, organization=organization)
    return await template_manager.list_templates(organization=organization)
