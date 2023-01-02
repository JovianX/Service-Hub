from sqlalchemy import JSON
from sqlalchemy import Enum
from enum import Enum as PyEnum
from sqlalchemy.ext.mutable import MutableDict


MutableJSON = MutableDict.as_mutable(JSON)


def enum_column(enum: PyEnum) -> Enum:
    return Enum(enum, values_callable=lambda enum: [item.value for item in enum])
