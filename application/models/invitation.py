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
from sqlalchemy.orm import backref
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.base_class import Base


class UserInvitation(Base):
    """
    Invitation of user to join organization.

    id - unique identifier.
    created_at - date when invitation was created.
    email - email of the invitee.
    status - status of invitation.
    expiration_period - period in hours after which invitation becomes expired.
                        If set to 0 invitation never expires.
    creator_id - identifier of User record that created this invitation.
    organization_id - identifier of the organization to which the user was
                      invited.
    """
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    email = Column(String, nullable=False)
    status = Column(String, nullable=False)
    expiration_period = Column(Integer, nullable=False)
    email_sent_at = Column(DateTime, nullable=True, default=None)
    created_user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=True)
    created_user = relationship('User', back_populates='invitation', lazy='selectin', foreign_keys=created_user_id)
    creator_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    creator = relationship('User', back_populates='created_invitations', lazy='selectin', foreign_keys=creator_id)
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='invitations', lazy='selectin')

    __table_args__ = (
        CheckConstraint('expiration_period >= 0', name='_expiration_period_greater_than_zero_c'),
    )
