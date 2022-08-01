"""
Application model
"""
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from application.db.base_class import Base


class Application(Base):
    """
    Represents deployed template.
    """
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    name = Column(String, nullable=False)
    description = Column(String, nullable=False, default='')
    manifest = Column(Text, nullable=False)
    status = Column(String, nullable=False)
    template_id = Column(Integer, ForeignKey('template_revision.id'), nullable=False)
    template = relationship('TemplateRevision', back_populates='applications', lazy='selectin')
    creator_id = Column(UUID, ForeignKey('user.id'), nullable=False)
    creator = relationship('User', back_populates='created_applications', lazy='selectin')
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='applications', lazy='selectin')