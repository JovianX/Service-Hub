"""
Helm constants.
"""
from .base_enum import StrEnum


class HttpStatuses(StrEnum):
    """
    Http release statuses.

    unknown - indicates that a release is in an uncertain state.
    deployed - indicates that the release has been pushed to Kubernetes.
    uninstalled - indicates that a release has been uninstalled from Kubernetes.
    superseded - indicates that this release object is outdated and a newer one exists.
    failed - indicates that the release was not successfully deployed.
    uninstalling - indicates that a uninstall operation is underway.
    """
    unknown = 'unknown'
    deployed = 'deployed'
    uninstalled = 'uninstalled'
    superseded = 'superseded'
    failed = 'failed'
    uninstalling = 'uninstalling'


class HttpHealthStatuses(StrEnum):
    """
    Http release operability statuses.
    """
    healthy = 'healthy'
    unhealthy = 'unhealthy'
