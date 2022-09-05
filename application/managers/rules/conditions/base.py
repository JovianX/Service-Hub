"""
Base condition class.
"""
from constants.rules import RuleAttribute
from constants.rules import RuleComparisonStatements
from managers.rules.schemas import RuleConditionSchema


class Condition:
    """
    Rule condition base class.

    Can be used as factory to get condition based on statement.
    Don't forget to add new inherired classes to __init__.py file to make Python
    interpreter aquntited about them.
    """
    attribute: RuleAttribute
    value: str
    values: dict[RuleAttribute, str]

    @property
    def statement(self) -> RuleComparisonStatements:
        """
        Rule comparison statement.
        """
        raise NotImplementedError()

    def __new__(cls, condition: dict | RuleConditionSchema, values: dict[RuleAttribute, str]):
        validated_condition = RuleConditionSchema.parse_obj(condition)
        statement = validated_condition.statement
        if statement not in RuleComparisonStatements:
            raise ValueError(f'Unknown statement: {statement}')

        class_mapping = {}
        for subclass in cls.__subclasses__():
            # Selfcheck that there no dublicating brands in classes.
            if subclass.statement in class_mapping:
                raise ValueError(
                    f'Duplicating implementation of condition "{statement}". Duplacating classes: {subclass.__name__} '
                    f'and {class_mapping[subclass.statement].__name__}'
                )
            class_mapping[subclass.statement] = subclass

        return object.__new__(class_mapping[statement])

    def __init__(self, condition: dict | RuleConditionSchema, values: dict[RuleAttribute, str]) -> None:
        if set(RuleAttribute) != set(values.keys()):
            # Just fool protection check.
            raise ValueError(f'Rule values set is not full. Sets delta: {set(RuleAttribute) ^ set(values.keys())}.')

        validated_condition = RuleConditionSchema.parse_obj(condition)
        self.attribute = validated_condition.attribute
        self.value = validated_condition.value
        self.values = values

    def __bool__(self) -> bool:
        return self.compare()

    def __repr__(self) -> str:
        attribute_value = self.values[self.attribute]
        return f'<Condition: {self.attribute}({attribute_value}) is {self.statement.replace("_", " ")} {self.value}>'

    def compare(self) -> bool:
        """
        Compares attribute and value.
        """
        raise NotImplementedError()
