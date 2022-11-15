"""
Events business logic.
"""
from fastapi import Depends

from constants.events import EventCategory
from schemas.events import EventSchema
from crud.event import EventDatabase
from crud.event import get_event_db
from models.organization import Organization


class EventManager:
    """
    Event manager.
    """
    db: EventDatabase

    def __init__(self, db: EventDatabase) -> None:
        self.db = db

    async def create(self, event: EventSchema):
        """
        Creates new event.
        """
        await self.db.create(event.dict())

    async def list_organization_events(self, organization: Organization, category: EventCategory) -> list[EventSchema]:
        """
        List of event of organization of specific category.
        """
        events = await self.db.list(organization_id=organization.id, category=category)

        return [EventSchema.from_orm(event) for event in events]


async def get_event_manager(db=Depends(get_event_db)):
    yield EventManager(db)
