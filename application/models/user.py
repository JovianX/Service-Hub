
from typing import List

from fastapi_users.db import SQLAlchemyBaseOAuthAccountTableUUID
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import relationship

from ..db.base_class import Base


class OAuthAccount(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    pass


class User(SQLAlchemyBaseUserTableUUID, Base):
    oauth_accounts: List[OAuthAccount] = relationship('OAuthAccount', lazy='joined')
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    organization = relationship('Organization', back_populates='members', lazy='joined')
    created_services = relationship('Service', back_populates='creator', lazy='joined')
    created_rules = relationship('Rule', back_populates='creator', lazy='joined')
    created_templates = relationship('Template', back_populates='creator', lazy='joined')
    created_template_revisions = relationship('ManifestRevision', back_populates='creator', lazy='joined')
