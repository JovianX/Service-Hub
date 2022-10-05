"""
Roles constants.
"""
from .base_enum import StrEnum


class Roles(StrEnum):
    """
    User roles.
    """
    admin = 'admin'
    operator = 'operator'
