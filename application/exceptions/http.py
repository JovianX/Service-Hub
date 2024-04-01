"""
Http related exceptions.
"""
from fastapi import status

from .common import CommonException


class HttpException(CommonException):
    """
    Base Http exception.
    """


class HttpNotOk(HttpException):
    """
    Raised when the response status code is not 200.
    """

    def __init__(self, status_code: int, message: str = None):
        super().__init__(
            status_code=status_code,
            message=f"Unexpected status code: {status_code}. Expected status code between 200 and 299."
        )
