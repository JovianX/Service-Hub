
from fastapi_users.db import SQLAlchemyBaseOAuthAccountTableUUID
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import relationship

from constants.roles import Roles
from db.base_class import Base


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    pass


class User(SQLAlchemyBaseUserTableUUID, Base):
    oauth_accounts: list[OAuthAccount] = relationship('OAuthAccount', lazy='selectin')
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    role = Column(Enum(Roles, values_callable=lambda enum: [item.value for item in enum]), nullable=True)
    organization = relationship('Organization', back_populates='members', lazy='selectin')
    created_services = relationship('Service', back_populates='creator', lazy='selectin')
    created_rules = relationship('Rule', back_populates='creator', lazy='selectin')
    created_templates = relationship('TemplateRevision', back_populates='creator', lazy='selectin')
    created_applications = relationship('Application', back_populates='creator', lazy='selectin')
    created_invitations = relationship(
        'UserInvitation', back_populates='creator', lazy='selectin', foreign_keys='UserInvitation.creator_id'
    )
    invitation = relationship(
        'UserInvitation', back_populates='created_user', lazy='selectin', uselist=False,
        foreign_keys='UserInvitation.created_user_id'
    )
    access_tokens = relationship('AccessToken', back_populates='user', lazy='selectin',)
