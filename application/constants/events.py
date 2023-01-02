"""
Event related constants.
"""
from .base_enum import StrEnum


class EventCategory(StrEnum):
    """
    Event severity levels.
    """
    access_token = 'access_token'
    application = 'application'
    helm = 'helm'
    hook = 'hook'
    organization = 'organization'


class EventSeverityLevel(StrEnum):
    """
    Event severity levels.
    """
    debug = 'debug'
    info = 'info'
    warning = 'warning'
    error = 'error'
