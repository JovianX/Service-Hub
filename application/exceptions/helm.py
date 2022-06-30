"""
Helm related exceptions.
"""
from fastapi import status

from .common import CommonException


class ReleaseAlreadyExistsException(CommonException):
    """
    Raised when operation can not be completed due existing release in namespace
    of cluster.
    """
    message: str
    status_code: int = status.HTTP_409_CONFLICT

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)
