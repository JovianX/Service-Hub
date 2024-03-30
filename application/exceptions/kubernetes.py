"""
Kubernetes related exeptions.
"""
import json

from fastapi import status
from kubernetes_asyncio.client.exceptions import ApiException

from .common import CommonException


class KubernetesException(CommonException):
    """
    Common exception for Kubernetes Python client and kubectl CLI.
    """

    def __init__(self, message: str, status_code: int | None = None) -> None:
        status_code = status_code or status.HTTP_503_SERVICE_UNAVAILABLE
        super().__init__(message=message, status_code=status_code)


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


class KubernetesClientException(KubernetesException):
    """
    Raised when unable to find entity.
    """
    message: str = 'Error during interaction with Kubernetes cluster.'
    details: dict
    api_response_code: int
    reason: str

    def __init__(self, message: str | None = None, *, details: dict, api_response_code: int, reason: str) -> None:
        self.details = details
        self.api_response_code = api_response_code
        self.reason = reason
        super().__init__(message or self.message)

    @classmethod
    def _is_matching(cls, error: ApiException) -> bool:
        """
        Returns True if Python Kubernetes exception corresponds this exception.
        """
        raise NotImplementedError()

    @classmethod
    def check_and_raise(cls, error: ApiException) -> None:
        if cls._is_matching(error):
            try:
                details = json.loads(error.body)
            except json.JSONDecodeError:
                details = {}
            raise cls(details.get('message'), details=details, api_response_code=error.status, reason=error.reason)


class K8sEntityDoesNotExistException(KubernetesClientException):
    """
    Raised when unable to find entity.
    """
    @classmethod
    def _is_matching(cls, error: ApiException) -> bool:
        if error.status == status.HTTP_404_NOT_FOUND and error.reason == 'Not Found':
            return True

        return False


class K8sAlreadyExistsException(KubernetesClientException):
    """
    Raised when there is conflict with existing Kubernetes entity.
    """
    @classmethod
    def _is_matching(cls, error: ApiException) -> bool:
        if error.status == status.HTTP_409_CONFLICT and error.reason == 'Conflict':
            return True

        return False


class KubectlException(KubernetesException):
    """
    Raised when call kubectl fails.
    """
    command: str
    stderr: str
    exit_code: int

    def __init__(self, message: str, *, command: str, stderr: str, exit_code: int) -> None:
        self.command = command
        self.stderr = stderr
        self.exit_code = exit_code
        super().__init__(message)


class ContextNotFoundException(KubernetesException):
    """
    Raised when context absent in Kubernetes configuration.
    """
    message: str

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(self.message, status.HTTP_404_NOT_FOUND)
