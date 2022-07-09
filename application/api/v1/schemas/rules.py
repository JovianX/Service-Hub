"""
Rules API schemas.
"""
from pydantic import BaseModel
from pydantic import Field

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class RuleCreateBodySchema(BaseModel):
    """
    Body of request for creating rule.
    """
    name: str = Field(description='Short description of rule')
    description: str | None = Field(description='Long description of rule', default='')
    condition_settings: dict = Field(description='Rule condition settings')
    action_settings: dict = Field(description='Rule action settings')


class RuleResponseSchema(BaseModel):
    """
    Response body of Rule.
    """
    id: int = Field(description='Rule unique identifier')
    order: int = Field(description='Order in which rules should be applied')
    name: str = Field(description='Short description of rule')
    description: str | None = Field(description='Long description of rule', default='')
    condition_settings: dict = Field(description='Rule condition settings')
    action_settings: dict = Field(description='Rule action settings')
    creator: UserResponseSchema = Field(description='User that have created this this service')
    organization: OrganizationResponseSchema = Field(description='Organization which own this service')

    class Config:
        orm_mode = True
