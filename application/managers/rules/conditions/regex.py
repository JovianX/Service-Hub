"""
Condition to check that string matches pattern.
"""
import re

from application.constants.rules import RuleComparisonStatements

from .base import Condition


class RegexCondition(Condition):
    """
    Checks that value attribute is matches defined regular expression.
    """

    statement = RuleComparisonStatements.regex

    def compare(self) -> bool:
        attribute_value = self.values[self.attribute]
        match = re.search(self.value, attribute_value)
        if match:
            return True

        return False
