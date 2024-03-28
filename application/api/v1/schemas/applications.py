"""
Applications related API schemas.
"""
from datetime import datetime
from typing import Any

from pydantic import BaseModel
from pydantic import Field
from pydantic import NonNegativeInt

from constants.applications import ApplicationHealthStatuses
from constants.applications import ApplicationStatuses

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class ApplicationTTLSchema(BaseModel):
    """
    Body of request for setting applicatoin TTL.
    """
    hours: NonNegativeInt = Field(description='Time to live in hours. If 0 pass, TTL will be removed.')


class InstallRequestBodySchema(BaseModel):
    """
    Body of request for application installation from specific template.
    """
    template_id: int = Field(description='Identifier of template from which application should be installed.')
    inputs: dict[str, Any] = Field(description='Inputs provided by user.')
    context_name: str = Field(description='Kubernetes configuration context name.')
    namespace: str = Field(description='Name of namespace where to install application.')
    ttl: ApplicationTTLSchema | None = Field(description='Application time to live.')
    dry_run: bool | None = Field(
        description='If `True` application installation will be simulated.',
        default=False
    )


class UpgradeRequestSchema(BaseModel):
    """
    Body of request for upgrade application manifest.
    """
    template_id: int = Field(description='Identifier of template to which upgrade manifest')
    dry_run: bool | None = Field(
        description="If `True` application's releases updating will be simulated",
        default=False
    )


class UserInputUpdateRequestSchema(BaseModel):
    """
    Body of request for change user inputs.
    """
    inputs: dict[str, Any] = Field(description='New user inputs')
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
    id: int = Field(description='Application record ID.')
    created_at: datetime = Field(description='Date and time when application was launched.')
    name: str = Field(description='Name of application.')
    description: str | None = Field(description='Application description.')
    ttl: datetime | None = Field(
        description='Date and time when application will reach end of life and will be terminated.')
    manifest: str = Field(description='Rendered template with which application was deployed or upgraded.')
    status: ApplicationStatuses = Field(description='Application condition status.')
    health: ApplicationHealthStatuses = Field(description='Application application health condition.')
    context_name: str = Field(description='Name of Kubernetes context that was used during application deploy.')
    namespace: str = Field(description='Name of namespace that was used during application deploy.')
    user_inputs: dict = Field(description='User provided values from template inputs.')
    template: ApplicationTemplateSchema = Field(description='Template from which application was deployed.')
    creator: UserResponseSchema = Field(description='User that have launched this application.')
    organization: OrganizationResponseSchema = Field(description='Organization that owns the application.')

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


class ApplicationUpgradeResponseSchema(BaseModel):
    """
    Response body of application upgrade.
    """
    install_outputs: dict[str, dict] = Field(description='List of installed components')
    update_outputs: dict[str, dict] = Field(description='List of updated components')
    uninstall_outputs: dict[str, dict] = Field(description='List of removed components')
