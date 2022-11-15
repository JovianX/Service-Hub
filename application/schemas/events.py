from datetime import datetime

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field

from constants.events import EventCategory
from constants.events import EventSeverityLevel


class EventSchema(BaseModel):
    created_at: datetime = Field(description='Event creation date and time.', default_factory=datetime.now)
    title: str = Field(description='Short event summary.')
    message: str = Field(description='Event detailed description.')
    severity: EventSeverityLevel = Field(description='Event detailed description.', default=EventSeverityLevel.info)
    organization_id: int = Field(description='Unique identifier of organization to which this event belongs.')
    category: EventCategory = Field(description='Kind of entities to which event related.')
    data: dict | None = Field(description='Event context.', default_factory=dict)

    class Config:
        extra = Extra.forbid
        orm_mode = True
