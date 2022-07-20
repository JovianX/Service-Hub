"""
Classes responsible for interaction with templates database entities.
"""
from fastapi import Depends
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from application.db.session import get_session
from application.models.template import Template

from .base import BaseDatabase


class TemplateDatabase(BaseDatabase):
    """
    CRUD operation for models.Template instances.
    """
    session: AsyncSession
    table: Template = Template

    async def make_default(self, template_id: int, organization_id: int):
        """
        Makes one of templates default.
        """
        template: Template = await self.get(id=template_id)
        await self.session.execute(
            update(self.table).where(self.table.organization_id == organization_id).values(default=False)
        )
        template.default = True
        self.save(template)

        return template


async def get_template_db(session=Depends(get_session)):
    yield TemplateDatabase(session)
