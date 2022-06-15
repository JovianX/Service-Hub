from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from application.db.base_class import Base


class Organization(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    members = relationship('User', back_populates='organization')
