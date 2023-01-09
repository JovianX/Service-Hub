"""
Applications related API schemas.
"""
from datetime import datetime

from pydantic import BaseModel
from pydantic import Field


from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class ApplicationTemplateSchema(BaseModel):
    """
    Application template API response body schema.
    """
    id: int = Field(description='Template ID')
    created_at: datetime = Field(description='Date and time of template creation in timestamp format')
    name: str | None = Field(description='Template name')
    description: str | None = Field(description='Template description')
    revision: int = Field(description='Template ID')
    enabled: bool = Field(description='Is this template active')
    default: bool = Field(description='Is this template used as default')
    template: str = Field(description='Original template YAML')


class ApplicationResponseSchema(BaseModel):
    """
    Application API response body schema.
    """
    id: int = Field(description='Application record ID.')
    created_at: datetime = Field(description='Date and time when application was launched.')
    name: str = Field(description='Name of application.')
    description: str | None = Field(description='Application description.')
    ttl: datetime | None = Field(
        description='Date and time when application will reach end of life and will be terminated.'
    )
    manifest: str = Field(description='Rendered template with which application was deployed or upgraded.')
    status: str = Field(description='Application condition status.')
    health: str = Field(description='Application application health condition.')
    context_name: str = Field(description='Name of Kubernetes context that was used during application deploy.')
    namespace: str = Field(description='Name of namespace that was used during application deploy.')
    user_inputs: dict = Field(description='User provided values from template inputs.')
    template: ApplicationTemplateSchema = Field(description='Template from which application was deployed.')
    creator: UserResponseSchema = Field(description='User that have launched this application.')
    organization: OrganizationResponseSchema = Field(description='Organization that owns the application.')
