"""
Templates related constants.
"""
from .base_enum import StrEnum


class InputTypes(StrEnum):
    """
    Template user input form widget types.
    """
    checkbox = 'checkbox'
    number = 'number'
    radio_select = 'radio_select'
    select = 'select'
    slider = 'slider'
    switch = 'switch'
    text = 'text'
    textarea = 'textarea'


class ComponentTypes(StrEnum):
    """
    Template application components types.
    """
    helm_chart = 'helm_chart'
