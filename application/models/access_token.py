"""
User invitation model
"""
from uuid import uuid4

from sqlalchemy import CheckConstraint
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from constants.access_tokens import AccessTokenStatuses
from db.base_class import Base
from db.fields import enum_column


class AccessToken(Base):
    """
    User access token.

    id - unique identifier.
    created_at - date when access token was created.
    status - status of access token.
    comment - description for this access token.
    user_id - identifier of User to which belongs the access token.
    creator_id - identifier of User record that created this access token.
    organization_id - identifier of the organization to which access token
                      belongs.
    """
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    status = Column(enum_column(AccessTokenStatuses), nullable=False)
    expiration_date = Column(DateTime, nullable=True)
    comment = Column(String, nullable=False, default='')
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    user = relationship('User', back_populates='access_tokens', lazy='selectin', foreign_keys=user_id)
    creator_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    creator = relationship('User', back_populates='created_access_tokens', lazy='selectin', foreign_keys=creator_id)
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='access_tokens', lazy='selectin')
