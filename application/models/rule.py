from sqlalchemy import JSON
from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from db.base_class import Base


class Rule(Base):
    """
    Rule that represents condition and action that must be executed if condition
    is true.
    """
    id = Column(Integer, primary_key=True, index=True)
    order = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False, default='')
    condition_settings = Column(JSON, nullable=False, default=[])
    action_settings = Column(JSON, nullable=False, default={})
    enabled = Column(Boolean, nullable=False, default=False)
    creator_id = Column(UUID, ForeignKey('user.id'), nullable=True)
    creator = relationship('User', back_populates='created_rules', lazy='selectin')
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='rules', lazy='selectin')
