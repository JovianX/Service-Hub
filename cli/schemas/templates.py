"""
Templates related API schemas.
"""
from datetime import datetime

from pydantic import BaseModel
from pydantic import Field


from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class TemplateResponseBodySchema(BaseModel):
    """
    Template response body schema.
    """
    id: int = Field(description='Template ID')
    created_at: datetime = Field(description='Date and time of template creation in timestamp format')
    name: str | None = Field(description='Template name')
    description: str | None = Field(description='Template description')
    revision: int = Field(description='Template ID')
    enabled: bool = Field(description='Is this template active')
    default: bool = Field(description='Is this template used as default')
    template: str = Field(description='Original template YAML')
    parsed_template: dict = Field(description='Parsed template YAML')
    creator: UserResponseSchema = Field(description='User that have created this template')
    organization: OrganizationResponseSchema = Field(description='Organization that owns the template')
