import re
from typing import Any

from sqlalchemy.ext.declarative import as_declarative
from sqlalchemy.ext.declarative import declared_attr

from .session import engine


camel_case_pattern = re.compile(r'(?<!^)(?=[A-Z])')


@as_declarative(bind=engine)
class Base:
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        """
        Generate __tablename__ automatically. Converts class camel case to snake
        case.
        """
        return camel_case_pattern.sub('_', cls.__name__).lower()
