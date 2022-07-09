from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path
from pydantic import conlist

from application.core.authentication import current_active_user
from application.managers.rules.manager import RuleManager
from application.managers.rules.manager import get_rule_manager
from application.models.user import User

from ..schemas.rules import RuleCreateBodySchema
from ..schemas.rules import RuleResponseSchema


router = APIRouter()


@router.post('/', response_model=RuleResponseSchema)
async def create_rule(
    rule: RuleCreateBodySchema = Body(description='Rule create data'),
    user: User = Depends(current_active_user),
    rule_manager: RuleManager = Depends(get_rule_manager)
):
    """
    Create new rule.
    """
    rules = await rule_manager.organization_rules(organization=user.organization)
    order = len(rules) + 1
    rule = await rule_manager.create_organization_rule(
        creator=user,
        order=order,
        name=rule.name,
        condition_settings=rule.condition_settings,
        action_settings=rule.action_settings,
        description=rule.description
    )

    return rule


@router.get('/list', response_model=list[RuleResponseSchema])
async def list_organization_rules(
    user: User = Depends(current_active_user),
    rule_manager: RuleManager = Depends(get_rule_manager)
):
    """
    Returns organization's rules.
    """
    organization = user.organization
    rules = await rule_manager.organization_rules(organization=organization)

    return rules


@router.post('/reorder', response_model=list[RuleResponseSchema])
async def reorder_rules(
    identifiers: conlist(int, unique_items=True) = Body(description='List of rule IDs'),
    user: User = Depends(current_active_user),
    rule_manager: RuleManager = Depends(get_rule_manager)
):
    """
    Reorders rules order according to id position in ID list.
    """
    return await rule_manager.reorder_rules(user.organization, identifiers)


@router.delete('/{rule_id}', response_model=list[RuleResponseSchema])
async def delete_rule(
    rule_id: int = Path(title='The ID of the service to delete'),
    user: User = Depends(current_active_user),
    rule_manager: RuleManager = Depends(get_rule_manager)
):
    """
    Deletes organization's rule.
    """
    organization = user.organization
    return await rule_manager.delete_organization_rule(organization=organization, rule_id=rule_id)



action_settings = {
    'type': 'audit',  # ['audit' | 'apply' | 'webhook']
}



# Nginx release values:
# persistence:
#   enabled: true
#   storageClass: "default"


# Rule 2 value
# persistence:
#   enabled: true
#   storageClass: "gp2"

