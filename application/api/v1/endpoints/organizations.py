from typing import Any

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Query

from core.authentication import AdminRolePermission
from core.authentication import AuthorizedUser
from core.authentication import OperatorRolePermission
from core.authentication import current_active_user
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from managers.organizations.settings_schemas import ROOT_SETTING_NAMES
from models.user import User
from schemas.kubernetes import KubernetesConfigurationSchema

from ..schemas.organization import DefaultContextRequestBody
from ..schemas.organization import K8sConfigurationResponseSchema


router = APIRouter(dependencies=[Depends(AuthorizedUser(AdminRolePermission))])


@router.post('/kubernetes-configuration', response_model=K8sConfigurationResponseSchema)
async def upload_configuration(
    incoming_configuration: KubernetesConfigurationSchema = Body(description='Kubernetes configuration'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Uploads(merges if exists) organization's Kubernetes configuration.
    """
    await organization_manager.update_kubernetes_configuration(user.organization, incoming_configuration.dict())
    configuration = organization_manager.get_kubernetes_configuration(user.organization)

    return {'configuration': configuration}


@router.get(
    '/kubernetes-configuration',
    response_model=K8sConfigurationResponseSchema,
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def get_configuration(
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns current organization's Kubernetes configuration.
    """
    configuration = organization_manager.get_kubernetes_configuration(user.organization)

    return {'configuration': configuration}


@router.delete('/kubernetes-configuration/context', response_model=K8sConfigurationResponseSchema)
async def delete_configuration_context(
    context_name: str = Query(alias='context-name'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Deletes context from organization's Kubernetes configuration.
    """
    organization = user.organization
    configuration = await organization_manager.delete_context(organization, context_name)

    return {'configuration': configuration}


@router.post('/kubernetes-configuration/set-default-context', response_model=K8sConfigurationResponseSchema)
async def set_default_configuration_context(
    data: DefaultContextRequestBody = Body(description='Default context data'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Sets default Kubernetes configuration context.
    """
    organization = user.organization
    configuration = await organization_manager.set_default_context(organization, data.context)

    return {'configuration': configuration}


@router.post('/settings/{setting_name}')
async def save_setting(
    setting_name: ROOT_SETTING_NAMES,
    setting_value: Any = Body(),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Sets specific organization setting.
    """
    organization = user.organization
    await organization_manager.update_setting(organization, setting_name, setting_value)


@router.get('/settings/{setting_name}')
async def get_setting(
    setting_name: ROOT_SETTING_NAMES,
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Returns value of requested setting.
    """
    organization = user.organization
    setting_value = organization_manager.get_setting(organization, setting_name)

    return setting_value
