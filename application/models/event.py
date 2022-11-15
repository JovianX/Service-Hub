from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from constants.events import EventCategory
from constants.events import EventSeverityLevel
from db.base_class import Base


EventCategoryType = Enum(EventCategory, values_callable=lambda enum: [item.value for item in enum])
EventSeverityLevelType = Enum(EventSeverityLevel, values_callable=lambda enum: [item.value for item in enum])


class Event(Base):
    """
    Event record.
    """
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    category = Column(EventCategoryType, nullable=False)
    severity = Column(EventSeverityLevelType, nullable=False)
    data = Column(JSON, nullable=False, default={})
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='events', lazy='selectin')
