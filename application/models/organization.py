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
    helm_home = Column(LargeBinary, nullable=True)
    members = relationship('User', back_populates='organization', lazy='joined')
