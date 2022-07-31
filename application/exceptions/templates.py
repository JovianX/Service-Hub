"""
Templates related exceptions.
"""
from fastapi import status

from .common import CommonException


class InvalidTemplateException(CommonException):
    """
    Raised when error was found in template YAML.
    """
    message: str

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
