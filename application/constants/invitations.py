"""
Contants related to user invitations.
"""

from .base_enum import StrEnum


class InvitationStatuses(StrEnum):
    """
    User invitation statuses.
    """
    pending = 'pending'
    used = 'used'
