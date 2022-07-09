"""
Classes responsible for interaction with rules database entities.
"""
from fastapi import Depends
from sqlalchemy import delete
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from application.db.session import get_session
from application.exceptions.rule import RuleDoesNotExistException
from application.models.rule import Rule

from .base import BaseDatabase


class RuleDatabase(BaseDatabase):
    """
    CRUD operation for models.Rule instances.
    """
    session: AsyncSession
    table: Rule = Rule

    async def list_by_organization(self, organization_id: int) -> None:
        """
        Returns ordered by `order` list of rules that belongs to organization.
        """
        result = await self.session.execute(
            select(self.table).where(self.table.organization_id == organization_id).order_by(self.table.order)
        )

        return result.unique().scalars().all()

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
