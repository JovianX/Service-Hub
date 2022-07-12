"""
Rules related schemas.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import root_validator

from application.constants.common import CloudProviders
from application.constants.rules import RuleAttribute
from application.constants.rules import RuleComparisonStatements


class RuleConditionSchema(BaseModel, extra=Extra.forbid):
    """
    Rule condition description.
    """
    attribute: RuleAttribute = Field(description='Attribute that value should be compared')
    statement: RuleComparisonStatements = Field(description='Comparison statement')
    value: str = Field(description='Value with which to compare')

    @root_validator
    def validate_attribure(cls, values):
        """
        Validates values if attribute is have some values limitations.
        """
        if not ('attribute' in values and 'value' in values):
            # Didn't pass standart validation. Exiting.
            return values
        attribute = values['attribute']
        value = values['value']

        if attribute == RuleAttribute.cloud_provider and value not in CloudProviders:
            raise ValueError(f'Invalid cloud provider value: "{value}". Valid are: {", ".join(CloudProviders)}.')

        return values
