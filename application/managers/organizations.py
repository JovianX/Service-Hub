"""
Classes that include business logic of Organizations.
"""
from faker import Faker
from fastapi import Depends

from ..crud.organizations import OrganizationDatabase
from ..db.session import get_session
from ..models.organization import Organization


class OrganizationManager:
    """
    Organization management logic.
    """
    db: OrganizationDatabase

    def __init__(self, db: OrganizationDatabase) -> None:
        self.db = db

    async def create(self, title: str = None) -> Organization:
        if not title:
            title = Faker().company()
        return await self.db.create({
            'title': title
        })


async def get_organization_db(session=Depends(get_session)):
    yield OrganizationDatabase(session)


async def get_organization_manager(organization_db=Depends(get_organization_db)):
    yield OrganizationManager(organization_db)
