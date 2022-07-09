"""
Rules bussines logic.
"""
from fastapi import Depends
from fastapi import status

from application.crud.rules import RuleDatabase
from application.crud.rules import get_rule_db
from application.exceptions.common import CommonException
from application.exceptions.rule import RuleDoesNotExistException
from application.models.organization import Organization
from application.models.rule import Rule
from application.models.user import User


class RuleManager:
    """
    Rule managment logic.
    """

    def __init__(self, db: RuleDatabase) -> None:
        self.db = db

    async def create_organization_rule(
        self,
        creator: User,
        order: int,
        name: str,
        condition_settings: dict,
        action_settings: dict,
        description: str | None = None
    ) -> Rule:
        """
        Creates instanse of rule.
        """
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

    async def delete_organization_rule(self, organization: Organization, rule_id: int) -> None:
        """
        Deletes rule that belongs to organization.
        """
        await self.db.delete_organization_rule(organization.id, rule_id)
        return await self.reorder_rules(organization)


async def get_rule_manager(organization_db=Depends(get_rule_db)):
    yield RuleManager(organization_db)
