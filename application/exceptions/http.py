"""
Helm related exceptions.
"""
from fastapi import status

from .common import CommonException


class HttpException(CommonException):
    """
    Base Http exception.
    """
