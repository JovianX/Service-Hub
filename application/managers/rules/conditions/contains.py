"""
Condition to check that one sequence contains another.
"""
from application.constants.rules import RuleComparisonStatements

from .base import Condition


class ContainsCondition(Condition):
    """
    Checks that one sequence contains another.
    """

    statement = RuleComparisonStatements.contains

    def compare(self) -> bool:
        attribute_value = self.values[self.attribute]
        return self.value in attribute_value
