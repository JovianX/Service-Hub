"""
Base enum classes.
"""
from enum import Enum
from enum import EnumMeta


class MetaEnum(EnumMeta):
    def __contains__(cls, item):
        try:
            cls(item)
        except ValueError:
            return False
        return True


class StrEnum(str, Enum, metaclass=MetaEnum):
    """
    Base string enum class.
    """
    pass
