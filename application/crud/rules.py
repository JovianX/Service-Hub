"""
Classes responsible for interaction with rules database entities.
"""
from fastapi import Depends
from sqlalchemy import delete
from sqlalchemy import select
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from constants.rules import RuleActions
from db.session import get_session
from exceptions.rule import RuleDoesNotExistException
from models.rule import Rule

from .base import BaseDatabase


class RuleDatabase(BaseDatabase):
    """
    CRUD operation for models.Rule instances.
    """
    session: AsyncSession
    table: Rule = Rule

    async def get_organization_rule_by_id(self, organization_id: int, rule_id: int) -> Rule:
        """
        Returns organization rule.
        """
        result = await self.session.execute(
            select(self.table)
            .where(self.table.organization_id == organization_id, self.table.id == rule_id)
        )

        return result.unique().scalars().first()

    async def list(
        self,
        organization_id: int = None,
        enabled: bool = None,
        action_type: RuleActions = None
    ) -> list[Rule]:
        """
        Returns ordered by `order` list of rules.
        """
        query = select(self.table)
        if organization_id is not None:
            query = query.where(self.table.organization_id == organization_id)
        if enabled is not None:
            query = query.where(self.table.enabled == enabled)
        if action_type is not None:
            query = query.where(self.table.action_settings['type'].as_string() == action_type)
        query = query.order_by(self.table.order)

        result = await self.session.execute(query)

        return result.unique().scalars().all()

    async def update_organization_rule_by_id(self, organization_id: int, rule_id: int, rule_data: dict) -> None:
        """
        Updates organization rule.
        """
        result = await self.session.execute(
            update(self.table)
            .where(self.table.organization_id == organization_id, self.table.id == rule_id)
            .values(**rule_data)
        )
        await self.session.commit()
        if result.rowcount < 1:
            raise RuleDoesNotExistException(
                f'Failed to update rule. Rule with ID: {rule_id} does not exist.'
            )

    async def delete_organization_rule(self, organization_id, rule_id: int | str) -> None:
        """
        Deletes organization's rule.
        """
        result = await self.session.execute(
            delete(self.table).where(self.table.id == rule_id, self.table.organization_id == organization_id)
        )
        await self.session.commit()

        deleted_row_count = result.rowcount
        if deleted_row_count < 1:
            raise RuleDoesNotExistException(
                f'Failed to delete rule. Rule with ID: {rule_id} does not exist.'
            )


async def get_rule_db(session=Depends(get_session)):
    yield RuleDatabase(session)
