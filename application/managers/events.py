"""
Events business logic.
"""
from fastapi import Depends

from constants.events import EventCategory
from schemas.events import EventSchema
from crud.events import EventDatabase
from crud.events import get_event_db
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

    async def list_organization_events(
        self, organization: Organization, category: EventCategory, **kwargs: dict
    ) -> list[EventSchema]:
        """
        List of event of organization of specific category.
        """
        if category == EventCategory.application and (application_id := kwargs.pop('application_id', None)) is not None:
            events = await self.db.list_for_application(organization_id=organization.id, application_id=application_id)
        elif category == EventCategory.helm and (repository := kwargs.pop('repository_name', None)) is not None:
            events = await self.db.list_for_helm_repository(organization_id=organization.id, repository_name=repository)
        elif category == EventCategory.helm and ((context := kwargs.pop('context', None)) is not None
                                                 and (namespace := kwargs.pop('namespace', None)) is not None
                                                 and (release_name := kwargs.pop('release_name', None)) is not None):
            events = await self.db.list_for_helm_release(
                organization_id=organization.id,
                context_name=context,
                namespace=namespace,
                release_name=release_name
            )
        else:
            events = await self.db.list(organization_id=organization.id, category=category)

        return [EventSchema.from_orm(event) for event in events]


async def get_event_manager(db=Depends(get_event_db)):
    yield EventManager(db)
