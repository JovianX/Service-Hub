"""
Organization entity related exceptions.
"""
from fastapi import status

from .common import CommonException


class DifferentOrganizationException(CommonException):
    """
    Raised when was attempt of interaction on entity of different organization.
    """
    message: str

    def __init__(self, message: str | None = None) -> None:
        self.message = message or 'Allowed only altering of entity of current organization.'
        super().__init__(message=self.message, status_code=status.HTTP_403_FORBIDDEN)
