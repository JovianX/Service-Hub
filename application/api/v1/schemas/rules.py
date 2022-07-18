"""
Rules API schemas.
"""
from typing import Any

from pydantic import BaseModel
from pydantic import Field
from pydantic import conlist

from application.constants.rules import RuleAuditResult
from application.managers.rules.schemas import RuleActionSettingsSchema
from application.managers.rules.schemas import RuleConditionSchema

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


Conditions = conlist(RuleConditionSchema, min_items=1, unique_items=True)


class RuleCreateBodySchema(BaseModel):
    """
    Body of request for creating rule.
    """
    name: str = Field(description='Short description of rule')
    description: str | None = Field(description='Long description of rule', default='')
    condition_settings: Conditions = Field(description='Rule condition settings')
    action_settings: RuleActionSettingsSchema = Field(description='Rule action settings')
    enabled: bool | None = Field(description='Shows rule activated or not', default=False)


class RuleUpdateBodySchema(BaseModel):
    """
    Body of request for updating rule.
    """
    name: str | None = Field(description='Short description of rule')
    description: str | None = Field(description='Long description of rule')
    condition_settings: Conditions | None = Field(description='Rule condition settings')
    action_settings: dict | None = Field(description='Rule action settings')
    enabled: bool | None = Field(description='Shows rule activated or not')


class RuleResponseSchema(BaseModel):
    """
    Response body of Rule.
    """
    id: int = Field(description='Rule unique identifier')
    order: int = Field(description='Order in which rules should be applied')
    name: str = Field(description='Short description of rule')
    description: str = Field(description='Long description of rule')
    condition_settings: Conditions = Field(description='Rule condition settings')
    action_settings: dict = Field(description='Rule action settings')
    enabled: bool = Field(description='Shows rule activated or not')
    creator: UserResponseSchema = Field(description='User that have created this this service')
    organization: OrganizationResponseSchema = Field(description='Organization which own this service')

    class Config:
        orm_mode = True


class ReleaseAuditResultDifferentValuesSchama(BaseModel):
    """
    Values difference during release auditing.
    """
    expected: Any = Field(description='Expected value')
    actual: Any = Field(description='Actual value')


class ReleaseAuditResultDifferenceSchama(BaseModel):
    """
    Difference between actual release values and expected during release
    auditing by rules.
    """
    absent_values: list[str] = Field(description='List of paths to values that is absent in release values')
    different_values: dict[str, ReleaseAuditResultDifferentValuesSchama] = Field(
        description='Paths and values that was expected and what was got'
    )


class ReleaseAuditResultResponceBodySchema(BaseModel):
    """
    Result response of release validation by rules.
    """
    status: RuleAuditResult = Field(description='Release audit result')
    difference: ReleaseAuditResultDifferenceSchama = Field(
        description='Difference between actual and expected results'
    )


class ValuesToApplyResultResponceBodySchema(BaseModel):
    """
    Response that contais description of values that can be updated in release.
    """
    values: dict = Field(description='Merged values of all rules')
    difference: ReleaseAuditResultDifferenceSchama = Field(
        description='Difference between actual and expected results'
    )
