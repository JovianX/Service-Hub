"""
Event related constants.
"""
from .base_enum import StrEnum


class EventCategory(StrEnum):
    """
    Event severity levels.
    """
    application = 'application'
    hook = 'hook'
    organization = 'organization'
    release = 'release'


class EventSeverityLevel(StrEnum):
    """
    Event severity levels.
    """
    debug = 'debug'
    info = 'info'
    warning = 'warning'
    error = 'error'
