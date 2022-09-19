"""
Kubernetes related exeptions.
"""
from .base import ServiceHubException


class ProxyRequestException(ServiceHubException):
    """
    Raised when proxy request to Kubernetes resource fails.
    """
    reason: str
    status_code: int

    def __init__(self, reason: str, status_code: int) -> None:
        self.reason = reason
        self.status_code = status_code
        super().__init__(reason)


class ClusterUnreachableException(ServiceHubException):
    """
    Raised when unable to connect to cluster.
    """
    message: str

    def __init__(self, message: str | None = None) -> None:
        self.message = message or 'Kubernetes cluster unreachable.'
        super().__init__(message)
