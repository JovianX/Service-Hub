"""
Database interaction exceptions.
"""
from typing import Any

from .common import CommonException


class RecordNotFoundException(CommonException):
    """
    Raised when failed to find record with given parameters.
    """
    model_class: Any
    message: str

    def __init__(self, model_class, message) -> None:
        self.model_class = model_class
        self.message = message
        super().__init__(message=message, status_code=404)
