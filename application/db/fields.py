from sqlalchemy import JSON
from sqlalchemy.ext.mutable import MutableDict

MutableJSON = MutableDict.as_mutable(JSON)
