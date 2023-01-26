"""
Organization entity related exceptions.
"""
from fastapi import status

from .common import CommonException


class OrganizationException(CommonException):
    """
    Base exception related with organization.
    """


class DifferentOrganizationException(OrganizationException):
    """
    Raised when was attempt of interaction on entity of different organization.
    """

    def __init__(self, message: str | None = None) -> None:
        message = message or 'Allowed only altering of entity of current organization.'
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN)


class OrganizationSettingException(OrganizationException):
    """
    Base exception related with organization settings.
    """


class UnknownOrganizationSettingException(OrganizationException):
    """
    Raised when requested unknow organization exception.
    """
    setting_name: str = None

    def __init__(self, message: str | None = None, * setting_name: str) -> None:
        self.setting_name = setting_name
        message = message or f'Unknown organization setting "{setting_name}".'
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)
