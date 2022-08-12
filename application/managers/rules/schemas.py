"""
Rules related schemas.
"""
from typing import Any
from typing import Literal

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import root_validator

from constants.common import CloudProviders
from constants.rules import RuleActions
from constants.rules import RuleAttribute
from constants.rules import RuleComparisonStatements


class RuleConditionSchema(BaseModel, extra=Extra.forbid):
    """
    Rule condition description.
    """
    attribute: RuleAttribute = Field(description='Attribute that value should be compared')
    statement: RuleComparisonStatements = Field(description='Comparison statement')
    value: str = Field(description='Value with which to compare')

    @root_validator(skip_on_failure=True)
    def validate_attribure(cls, values: dict) -> dict:
        """
        Validates values if attribute is have some values limitations.
        """
        attribute = values['attribute']
        value = values['value']

        if attribute == RuleAttribute.cloud_provider and value not in CloudProviders:
            raise ValueError(f'Invalid cloud provider value: "{value}". Valid are: {", ".join(CloudProviders)}.')

        return values


class RuleAuditActionSchema(BaseModel, extra=Extra.forbid):
    """
    Rule audit action description.
    """
    type: Literal[RuleActions.audit] = Field(description='Type of action')
    values: dict = Field(description='Values that must be checked')


class RuleApplyActionSchema(RuleAuditActionSchema):
    """
    Rule apply action description.
    """
    type: Literal[RuleActions.apply] = Field(description='Type of action')


class RuleActionSettingsSchema(BaseModel, extra=Extra.forbid):
    """
    Rule action settings.
    """
    __root__: RuleAuditActionSchema | RuleApplyActionSchema = Field(discriminator='type')

    def __iter__(self):
        return iter(self.__root__)

    def __getitem__(self, item):
        return self.__root__[item]

    def __getattribute__(self, name: str) -> Any:
        try:
            value = super().__getattribute__(name)
        except AttributeError:
            value = getattr(self.__root__, name)

        return value

    def dict(self, *args, **kwargs) -> dict:
        data = super().dict(*args, **kwargs)

        return data['__root__']
