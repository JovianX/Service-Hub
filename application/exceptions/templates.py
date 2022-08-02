"""
Templates related exceptions.
"""
from fastapi import status

from .common import CommonException


class TemplateException(CommonException):
    """
    Common template exception.
    """


class InvalidTemplateException(TemplateException):
    """
    Raised when error was found in template YAML.
    """
    message: str

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


class InvalidUserInputsException(TemplateException):
    """
    Raised when template user inputs is invalid.
    """
    message: str

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message=message, status_code=status.HTTP_400_BAD_REQUEST)
