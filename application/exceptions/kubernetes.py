"""
Kubernetes related exeptions.
"""
from fastapi import status

from .common import CommonException


class KubernetesException(CommonException):
    """
    Common exception for Kubernetes Python client and kubectl CLI.
    """


class ProxyRequestException(KubernetesException):
    """
    Raised when proxy request to Kubernetes resource fails.
    """
    reason: str
    status_code: int

    def __init__(self, reason: str, status_code: int) -> None:
        self.reason = reason
        self.status_code = status_code
        super().__init__(reason)


class ClusterUnreachableException(KubernetesException):
    """
    Raised when unable to connect to cluster.
    """
    message: str

    def __init__(self, message: str | None = None) -> None:
        self.message = message or 'Kubernetes cluster unreachable.'
        super().__init__(message)


class KubectlException(KubernetesException):
    """
    Raised when call kubectl fails.
    """
    message: str

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class ContextNotFoundException(KubernetesException):
    """
    Raised when context absent in Kubernetes configuration.
    """
    message: str

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(self.message, status.HTTP_404_NOT_FOUND)
