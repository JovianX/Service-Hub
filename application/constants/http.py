"""
Helm constants.
"""
from .base_enum import StrEnum


class HttpStatuses(StrEnum):
    """
    Helm release statuses.

    unknown - indicates that a release is in an uncertain state.
    deployed - indicates that the release has been pushed to Kubernetes.
    uninstalled - indicates that a release has been uninstalled from Kubernetes.
    superseded - indicates that this release object is outdated and a newer one exists.
    failed - indicates that the release was not successfully deployed.
    uninstalling - indicates that a uninstall operation is underway.
    pending-install - indicates that an install operation is underway.
    pending-upgrade - indicates that an upgrade operation is underway.
    pending-rollback - indicates that an rollback operation is underway.
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


class HttpHealthStatuses(StrEnum):
    """
    Helm release operability statuses.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'
