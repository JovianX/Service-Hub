"""
Helm constants.
"""
from .base_enum import StrEnum


class ReleaseStatuses(StrEnum):
    """
    Helm release statuses.
    """
    unknown = 'unknown'
    deployed = 'deployed'
    uninstalled = 'uninstalled'
    superseded = 'superseded'
    failed = 'failed'
    uninstalling = 'uninstalling'
    pending_install = 'pending-install'
    pending_upgrade = 'pending-upgrade'
    pending_rollback = 'pending-rollback'


class ReleaseHealthStatuses(StrEnum):
    """
    Helm release operability statuses.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'
