"""
Rules bussines logic.
"""
from fastapi import Depends
from fastapi import status

from application.constants.rules import RuleAttribute
from application.crud.rules import RuleDatabase
from application.crud.rules import get_rule_db
from application.exceptions.common import CommonException
from application.exceptions.rule import RuleDoesNotExistException
from application.models.organization import Organization
from application.models.rule import Rule
from application.models.user import User
from application.utils.kubernetes import KubernetesConfiguration

from .actions.manager import ActionManager
from .conditions import Condition


class RuleManager:
    """
    Rule managment logic.
    """

    def __init__(self, db: RuleDatabase) -> None:
        self.db = db

    async def create_organization_rule(
        self,
        creator: User,
        name: str,
        condition_settings: dict,
        action_settings: dict,
        order: int | None = None,
        description: str | None = None
    ) -> Rule:
        """
        Creates instanse of rule.
        """
        if order is None:
            rules = await self.organization_rules(organization=creator.organization)
            order = len(rules) + 1
        if description is None:
            description = ''
        rule = {
            'order': order,
            'name': name,
            'description': description,
            'condition_settings': condition_settings,
            'action_settings': action_settings,
            'creator_id': str(creator.id),
            'organization_id': creator.organization.id,
        }
        return await self.db.create(rule)

    async def organization_rules(self, organization: Organization) -> list[Rule]:
        """
        List all organization rules.
        """
        return await self.db.list_by_organization(organization.id)

    async def reorder_rules(self, organization: Organization, id_list: list[int] | None = None) -> list[Rule]:
        """
        Reorders rules according to list of rule IDs.
        """
        rules = await self.db.list_by_organization(organization.id)
        rules_mapping = {rule.id: rule for rule in rules}
        if id_list is None:
            id_list = [rule.id for rule in rules]
        extra_ids = set(id_list) - set(rules_mapping.keys())
        if extra_ids:
            ids = ', '.join([str(item) for item in extra_ids])
            raise RuleDoesNotExistException(f'Rule(s) with ID(s): {ids} do not exist.')
        missing_ids = set(rules_mapping.keys()) - set(id_list)
        if missing_ids:
            ids = ', '.join([str(item) for item in missing_ids])
            raise CommonException(
                f'Full list rule IDs is required to reorder rules. Missing IDs: {ids}',
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        reordered_rules = []
        for index, rule_id in enumerate(id_list, start=1):
            rule = rules_mapping[rule_id]
            rule.order = index
            await self.db.save(rule)
            reordered_rules.append(rule)

        return reordered_rules

    async def update_organization_rule(self, organization: Organization, rule_id: int, rule_data: dict) -> None:
        """
        Deletes rule that belongs to organization.
        """
        await self.db.update_organization_rule_by_id(organization.id, rule_id, rule_data)
        return await self.db.get_organization_rule_by_id(organization.id, rule_id)

    async def delete_organization_rule(self, organization: Organization, rule_id: int) -> None:
        """
        Deletes rule that belongs to organization.
        """
        await self.db.delete_organization_rule(organization.id, rule_id)
        return await self.reorder_rules(organization)

    async def validate(
        self,
        organization: Organization,
        k8s_configuration: KubernetesConfiguration,
        context_name: str,
        namespace: str,
        release_name: str,
        computed_values: dict
    ):
        """
        Validates rules agains release.
        """
        values = {
            RuleAttribute.context_name: context_name,
            RuleAttribute.namespace: namespace,
            RuleAttribute.release_name: release_name,
            RuleAttribute.cloud_provider: k8s_configuration.get_cloud_provider(context_name),
            RuleAttribute.cluster_region: k8s_configuration.get_region(context_name)
        }
        rules = await self.db.list_by_organization_available(organization.id)

        matched_rules = []
        for rule in rules:
            conditoins = [Condition(item, values) for item in rule.condition_settings]
            if all(conditoins):
                matched_rules.append(rule)

        action_manager = ActionManager([rule.action_settings for rule in matched_rules])
        return action_manager.execute_audit(computed_values)


async def get_rule_manager(organization_db=Depends(get_rule_db)):
    yield RuleManager(organization_db)
