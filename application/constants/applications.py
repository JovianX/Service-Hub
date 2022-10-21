"""
Application related constants.
"""
from .base_enum import StrEnum


class ApplicationStatuses(StrEnum):
    """
    Application operational statuses.
    """
    created = 'created'
    error = 'error'
    starting = 'starting'
    running = 'running'
    updating = 'updating'


class ApplicationHealthStatuses(StrEnum):
    """
    Application health statuses.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'
