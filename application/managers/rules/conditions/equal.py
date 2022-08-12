"""
Condition to check for equality.
"""
from constants.rules import RuleComparisonStatements

from .base import Condition


class EqualCondition(Condition):
    """
    Checks that value attribute is equal to defined value.
    """

    statement = RuleComparisonStatements.equal

    def compare(self) -> bool:
        attribute_value = self.values[self.attribute]
        return self.value == attribute_value
