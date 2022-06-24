"""
Helm constants.
"""
from enum import Enum


class ReleaseStatuses(str, Enum):
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


class ReleaseHealthStatuses(str, Enum):
    """
    Helm release operability statuses.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'
