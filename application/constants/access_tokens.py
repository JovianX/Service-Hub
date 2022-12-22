"""
User access token constants.
"""
from .base_enum import StrEnum


class AccessTokenStatuses(StrEnum):
    """
    User access token statuses.
    """
    active = 'active'
    disabled = 'disabled'
