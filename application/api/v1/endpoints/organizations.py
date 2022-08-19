from typing import Any

from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Query

from core.authentication import current_active_user
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from managers.organizations.settings_schemas import ROOT_SETTING_NAMES
from managers.users import UserManager
from managers.users import get_user_manager
from models.user import User
from schemas.kubernetes import KubernetesConfigurationSchema

from ..schemas.common import UserResponseSchema
from ..schemas.organization import K8sConfigurationResponseSchema


router = APIRouter()


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


@router.get('/kubernetes-configuration', response_model=K8sConfigurationResponseSchema)
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


@router.get('/users', response_model=list[UserResponseSchema])
async def get_setting(
    user: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager)
):
    """
    Returns organization's user list.
    """
    return await user_manager.organization_users(user.organization)
