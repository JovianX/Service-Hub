"""
Applications related API schemas.
"""
from datetime import datetime

from pydantic import BaseModel
from pydantic import Field

from application.constants.applications import ApplicationStatuses

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class InstallRequestBodySchema(BaseModel):
    """
    Body of request for application installation from specific template.
    """
    template_id: int = Field(description='Identifier of template from which application should be installed')
    inputs: dict = Field(description='Inputs provided by user')
    context_name: str = Field(description='Kubernetes configuration context name')
    namespace: str = Field(description='Name of namespace where to install application')
    dry_run: bool | None = Field(
        description='If `True` application installation will be simulated',
        default=False
    )


class UpdateRequestSchema(BaseModel):
    """
    Body of request for update release values.
    """
    values: dict[str, dict] = Field(description='Mapping of release names and relase values to update')
    dry_run: bool | None = Field(
        description="If `True` application's releases updating will be simulated",
        default=False
    )


class ApplicationTemplateSchema(BaseModel):
    """
    Application template response body schema.
    """
    id: int = Field(description='Template ID')
    created_at: datetime = Field(description='Date and time of template creation in timestamp format')
    name: str | None = Field(description='Template name')
    description: str | None = Field(description='Template description')
    revision: int = Field(description='Template ID')
    enabled: bool = Field(description='Is this template active')
    default: bool = Field(description='Is this template used as default')
    template: str = Field(description='Original template YAML')

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }


class ApplicationResponseSchema(BaseModel):
    """
    Application response body schema.
    """
    id: int = Field(description='Application record ID')
    created_at: datetime = Field(description='Date and time when application was launched')
    name: str = Field(description='Name of application')
    description: str | None = Field(description='Application description')
    manifest: str = Field(description='Rendered template with which application was deployed or upgraded')
    status: ApplicationStatuses = Field(description='Application condition statuses')
    context_name: str = Field(description='')
    namespace: str = Field(description='')
    user_inputs: dict = Field(description='')
    template: ApplicationTemplateSchema = Field(description='')
    creator: UserResponseSchema = Field(description='User that have launched this application')
    organization: OrganizationResponseSchema = Field(description='Organization that owns the application')

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }


class ApplicationInstallResponseSchema(BaseModel):
    """
    Response body of application installation.
    """
    application: ApplicationResponseSchema | None = Field(description='Application database record')
    results: dict[str, dict] = Field(description='Application installation result for each release')
