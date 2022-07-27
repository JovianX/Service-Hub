from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import LargeBinary
from sqlalchemy import String
from sqlalchemy.orm import relationship

from application.db.base_class import Base


class Organization(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    settings = Column(JSON, nullable=False, default={})
    kubernetes_configuration = Column(JSON, nullable=False, default={'configuration': {}, 'metadata': {}})
    helm_home = Column(LargeBinary, nullable=True)
    members = relationship('User', back_populates='organization', lazy='selectin')
    services = relationship('Service', back_populates='organization', lazy='selectin')
    rules = relationship('Rule', back_populates='organization', lazy='selectin')
    templates = relationship('TemplateRevision', back_populates='organization', lazy='selectin')
    applications = relationship('Application', back_populates='organization', lazy='selectin')
