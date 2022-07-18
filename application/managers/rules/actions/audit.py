"""
Audit rule action.
"""
from application.constants.rules import RuleActions

from .base import Action


class Audit(Action):
    """
    Checks computed values of helm release.
    """
    type: RuleActions = RuleActions.audit
