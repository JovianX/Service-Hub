"""
Templates related constants.
"""
from .base_enum import StrEnum


class InputTypes(StrEnum):
    """
    Template user input types.
    """
    string = 'string'
    select = 'select'
    checkbox = 'checkbox'
