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


class HookOnFailureBehavior(StrEnum):
    """
    Template application behavior on hook failure types.

    stop - if hook fails application action fails too.
    continue - if hook fails skip this failed hook and continue application
               action execution.
    """
    stop = 'stop'
    skip = 'continue'


class HookTypes(StrEnum):
    """
    Template application hook types.
    """
    kubernetes_job = 'kubernetes_job'
