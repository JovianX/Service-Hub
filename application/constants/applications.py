"""
Application related constants.
"""
from .base_enum import StrEnum


class ApplicationStatuses(StrEnum):
    """
    Application operational statuses.

    Statuses life-cycles:
    Installing: deploy_requested -> deploying -> (deployed | error).
    Upgrading: upgrade_requested -> upgrading -> (deployed | error).
    Termination: termination_requested -> terminating -> (<application deleted> | error)
    """
    deploy_requested = 'deploy_requested'
    deployed = 'deployed'
    deploying = 'deploying'
    error = 'error'
    terminating = 'terminating'
    termination_requested = 'termination_requested'
    upgrade_requested = 'upgrade_requested'
    upgrading = 'upgrading'


class ApplicationHealthStatuses(StrEnum):
    """
    Application health statuses.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'
