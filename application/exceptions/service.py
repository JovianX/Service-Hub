"""
Service catalog related exceptions.
"""
from fastapi import status

from .common import CommonException


class ServiceDoesNotExistException(CommonException):
    """
    Raised when operation can not be completed due non existing service from
    service catalog.
    """
    message: str
    status_code: int = status.HTTP_404_NOT_FOUND

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message, self.status_code)
