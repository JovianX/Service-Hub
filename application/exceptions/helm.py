"""
Helm related exceptions.
"""
from fastapi import status

from .common import CommonException


class HelmException(CommonException):
    """
    Base Helm exception.
    """


class ReleaseAlreadyExistsException(HelmException):
    """
    Raised when operation can not be completed due existing release in namespace
    of cluster.
    """
    message: str
    status_code: int = status.HTTP_409_CONFLICT

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)


class ReleaseNotFoundException(HelmException):
    """
    Raised when operation can not be completed due non existing release in
    namespace of cluster.
    """
    message: str
    status_code: int = status.HTTP_404_NOT_FOUND

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)


class RepositoryNotFoundException(HelmException):
    """
    Raised when operation can not be completed due non existing repository.
    """
    message: str
    status_code: int = status.HTTP_404_NOT_FOUND

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)


class ChartNotFoundException(HelmException):
    """
    Raised when operation can not be completed due non existing chart in
    repository.
    """
    message: str
    status_code: int = status.HTTP_404_NOT_FOUND

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)


class ChartInstallException(HelmException):
    """
    Raised when Helm chart was unsuccessful.
    """
    message: str
    status_code: int = status.HTTP_503_SERVICE_UNAVAILABLE

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)


class ReleaseUpdateException(HelmException):
    """
    Raised when release update was unsuccessful.
    """
    message: str
    status_code: int = status.HTTP_503_SERVICE_UNAVAILABLE

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)
