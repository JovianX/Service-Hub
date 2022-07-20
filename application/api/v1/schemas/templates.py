"""
Templates related API schemas.
"""
from pydantic import BaseModel
from pydantic import Field

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class TemplateCreateBodySchema(BaseModel):
    """
    Template create request body schema.
    """
    manifest: str = Field(description='Raw manifest YAML')
    description: str | None = Field(description='Description of the template')
    enabled: bool = Field(description='Is this template active')


class TemplateResponseBodySchema(BaseModel):
    """
    Template response body schema.
    """
    id: int = Field(description='Template ID')
    name: str | None = Field(description='Template name')
    description: str | None = Field(description='Template description')
    enabled: bool = Field(description='Is this template active')
    default: bool = Field(description='Is this template used as default')
    manifest: dict = Field(description='Manifest of the template')
    creator: UserResponseSchema = Field(description='User that have created this template')
    organization: OrganizationResponseSchema = Field(description='Organization that owns the template')


class TemplateUpdateBodySchema(BaseModel):
    """
    Template update request body schema.
    """
    name: str | None = Field(description='Template name', default='')
    description: str | None = Field(description='Template description', default='')
    enabled: bool = Field(description='Is this template active')
