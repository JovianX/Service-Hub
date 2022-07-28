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

    def __init__(self, model_class: Any, message: str) -> None:
        self.model_class = model_class
        self.message = message
        super().__init__(message=message, status_code=404)


class DuplicatesFoundException(CommonException):
    """
    Raised when found duplicating records.
    """
    model_class: Any
    message: str
    duplicates: list

    def __init__(self, model_class: Any, message: str, duplicates: list = None) -> None:
        self.model_class = model_class
        self.message = message
        self.duplicates = duplicates if duplicates is not None else []

        super().__init__(message=message, status_code=400)


class UnknownModelAttributeException(CommonException):
    """
    Raised when during processing of record faced unknown attribute.
    """
    model_class: Any
    message: str

    def __init__(self, model_class: Any, message: str) -> None:
        self.model_class = model_class
        self.message = message
        super().__init__(message=message, status_code=500)
