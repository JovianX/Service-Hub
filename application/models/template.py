"""
Template model
"""
from sqlalchemy import JSON
from sqlalchemy import Boolean
from sqlalchemy import CheckConstraint
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from application.db.base_class import Base


class TemplateRevision(Base):
    """
    Template that represents solution components.
    """
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    name = Column(String, nullable=False)
    description = Column(String, nullable=False, default='')
    revision = Column(Integer, nullable=False, default=1)
    yaml = Column(Text, nullable=False)
    template = Column(JSON, nullable=False, default={})
    enabled = Column(Boolean, nullable=False, default=False)
    default = Column(Boolean, nullable=False, default=False)
    creator_id = Column(UUID, ForeignKey('user.id'), nullable=False)
    creator = relationship('User', back_populates='created_templates', lazy='joined')
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='templates', lazy='joined')

    __table_args__ = (
        UniqueConstraint('organization_id', 'name', 'revision', name='_organization_name_uc'),
        CheckConstraint('revision > 0', name='_revision_greater_than_zero_c'),
    )