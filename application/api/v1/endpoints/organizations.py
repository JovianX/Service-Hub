from fastapi import APIRouter
from fastapi import Depends

from application.core.authentication import current_active_user
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.managers.organizations.settings_schemas import ROOT_SETTING_NAMES
from application.managers.organizations.settings_schemas import ROOT_SETTING_SCHEMAS
from application.models.user import User


router = APIRouter()


@router.post('/settings/{setting_name}')
async def save_setting(
    data: ROOT_SETTING_SCHEMAS,
    setting_name: ROOT_SETTING_NAMES,
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    Sets specific organization setting.
    """
    organization = user.organization
    await organization_manager.update_setting(organization, setting_name, data)


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
