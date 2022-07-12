"""
Condition to check for inequality.
"""
from application.constants.rules import RuleComparisonStatements

from .base import Condition


class NotEqualCondition(Condition):
    """
    Checks that value attribute is not equal to defined value.
    """

    statement = RuleComparisonStatements.not_equal

    def compare(self) -> bool:
        attribute_value = self.values[self.attribute]
        return self.value != attribute_value
