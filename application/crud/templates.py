"""
Classes responsible for interaction with templates database entities.
"""
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session
from models.template import TemplateRevision

from .base import BaseDatabase


class TemplateDatabase(BaseDatabase):
    """
    CRUD operation for models.TemplateRevision instances.
    """
    session: AsyncSession
    table: TemplateRevision = TemplateRevision

    async def get_last_revision(self, organization_id: int, name: str) -> TemplateRevision | None:
        """
        Returns lase template revision.
        """
        templates = await self.list(organization_id=organization_id, name=name)
        if not templates:
            return

        return templates[-1]

    async def list(self, query=None, **parameters) -> list:
        query = select(self.table).order_by(self.table.revision)

        return await super().list(query, **parameters)

    async def make_default(self, template_id: int, organization_id: int):
        """
        Makes one of templates default.
        """
        template: TemplateRevision = await self.get(id=template_id)
        await self.session.execute(
            update(self.table).where(self.table.organization_id == organization_id).values(default=False)
        )
        template.default = True
        await self.save(template)
        await self.session.commit()

        return template


async def get_template_db(session=Depends(get_session)):
    yield TemplateDatabase(session)
