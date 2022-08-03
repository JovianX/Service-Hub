from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import Path
from fastapi import Query
from pydantic import conlist

from application.core.authentication import current_active_user
from application.managers.helm.manager import HelmManager
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.managers.rules.manager import RuleManager
from application.managers.rules.manager import get_rule_manager
from application.models.user import User

from ..schemas.rules import ReleaseAuditResultResponceBodySchema
from ..schemas.rules import RuleCreateBodySchema
from ..schemas.rules import RuleResponseSchema
from ..schemas.rules import RuleUpdateBodySchema
from ..schemas.rules import ValuesToApplyResultResponceBodySchema


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
    rule_data = rule.dict()
    created_rule = await rule_manager.create_organization_rule(
        creator=user,
        name=rule_data['name'],
        condition_settings=rule_data['condition_settings'],
        action_settings=rule_data['action_settings'],
        description=rule_data['description'],
        enabled=rule_data['enabled'],
    )

    return created_rule


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


@router.patch('/{rule_id}', response_model=RuleResponseSchema)
async def update_rule(
    rule_id: int = Path(title='The ID of the service to update'),
    rule_data: RuleUpdateBodySchema = Body(description='Rule update data'),
    user: User = Depends(current_active_user),
    rule_manager: RuleManager = Depends(get_rule_manager)
):
    """
    Updates rule's attributes.
    """
    return await rule_manager.update_organization_rule(
        user.organization,
        rule_id=rule_id,
        rule_data=rule_data.dict(exclude_unset=True)
    )


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


@router.get('/release-audit', response_model=ReleaseAuditResultResponceBodySchema)
async def audit_release(
    context_name: str = Query(alias='context-name', description='Name of context'),
    namespace: str = Query(description='Name space where release is located'),
    release_name: str = Query(alias='release-name', description='Name of release against which validate rules'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager),
    rule_manager: RuleManager = Depends(get_rule_manager)
):
    """
    Audits release by rules.
    """
    organization = user.organization
    kubernetes_configuration = organization_manager.get_kubernetes_configuration(organization)
    helm_manager = HelmManager(organization_manager)
    computed_values = await helm_manager.computed_values(
        organization=organization, context_name=context_name, namespace=namespace, release_name=release_name
    )
    return await rule_manager.validate(
        organization=organization,
        k8s_configuration=kubernetes_configuration,
        context_name=context_name,
        namespace=namespace,
        release_name=release_name,
        computed_values=computed_values
    )


@router.get('/values-to-apply', response_model=ValuesToApplyResultResponceBodySchema)
async def values_to_apply(
    context_name: str = Query(alias='context-name', description='Name of context'),
    namespace: str = Query(description='Name space where release is located'),
    release_name: str = Query(alias='release-name', description='Name of release against which check rules'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager),
    rule_manager: RuleManager = Depends(get_rule_manager)
):
    """
    Values that can be updated during release values update.
    """
    organization = user.organization
    kubernetes_configuration = organization_manager.get_kubernetes_configuration(organization)
    helm_manager = HelmManager(organization_manager)
    computed_values = await helm_manager.computed_values(
        organization=organization, context_name=context_name, namespace=namespace, release_name=release_name
    )
    return await rule_manager.show_values_to_apply(
        organization=organization,
        k8s_configuration=kubernetes_configuration,
        context_name=context_name,
        namespace=namespace,
        release_name=release_name,
        computed_values=computed_values
    )
