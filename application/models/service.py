from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from application.db.base_class import Base


class Service(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False, default='')
    health_check_settings = Column(JSON, nullable=False, default={})
    type = Column(String, nullable=False)
    creator_id = Column(UUID, ForeignKey('user.id'), nullable=False)
    creator = relationship('User', back_populates='created_services', lazy='joined')
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='services', lazy='joined')
