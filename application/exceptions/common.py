"""
General project exceptions.
"""
from .base import ServiceHubException


class CommonException(ServiceHubException):
    """
    Common Service Hub exception.

    Message of this class and all classes that inherited from this will be
    delivered to front-end with settled status code.
    """
    message: str
    status_code: int

    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)
