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
    def __init__(self, message: str) -> None:
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


class InvalidUserInputsException(TemplateException):
    """
    Raised when template user inputs is invalid.
    """
    def __init__(self, message: str) -> None:
        super().__init__(message=message, status_code=status.HTTP_400_BAD_REQUEST)


class TemlateVariableNotFoundException(TemplateException):
    """
    Raised when template have variables that absent in rendering context.
    """
    def __init__(self, message: str, variable: str) -> None:
        self.variable = variable
        super().__init__(message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
