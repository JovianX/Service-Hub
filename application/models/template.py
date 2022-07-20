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


class Template(Base):
    """
    Template that represents solution components.
    """
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    name = Column(String, nullable=False)
    description = Column(String, nullable=False, default='')
    enabled = Column(Boolean, nullable=False, default=False)
    creator_id = Column(UUID, ForeignKey('user.id'), nullable=False)
    creator = relationship('User', back_populates='created_templates', lazy='joined')
    default_revision_id = Column(Integer, ForeignKey('manifest_revision.id', use_alter=True), nullable=True)
    default_revision = relationship('ManifestRevision', lazy='joined')
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='templates', lazy='joined')
    revisions = relationship('ManifestRevision', back_populates='template', lazy='joined')

    __table_args__ = (
        UniqueConstraint('organization_id', 'name', name='_organization_name_uc'),
    )


class ManifestRevision(Base):
    """
    Template template manifest revision.
    """
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    revision = Column(Integer, nullable=False, default=1)
    raw_manifest = Column(Text, nullable=False)
    manifest = Column(JSON, nullable=False, default={})
    comment = Column(String, nullable=False, default='')
    template_id = Column(Integer, ForeignKey('template.id'), nullable=False)
    template = relationship('Template', back_populates='revisions', lazy='joined')
    creator_id = Column(UUID, ForeignKey('user.id'), nullable=False)
    creator = relationship('User', back_populates='created_template_revisions', lazy='joined')

    __table_args__ = (
        CheckConstraint('revision > 0', name='_revision_greater_than_zero_c'),
    )
