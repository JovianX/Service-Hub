"""
Request and response schemas for API v1.
"""
from typing import Annotated
from typing import Literal
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field
from pydantic import constr

from application.constants.services import ServiceTypes
from application.managers.services.schemas import HTTPEndpointHealthCheckSettingsSchema
from application.managers.services.schemas import KubernetesResourceHealthCheckSettingsSchema


class CreateServiceBodyBaseSchema(BaseModel):
    """
    Body of request for service creation from service catalog.
    """
    name: constr(min_length=3, strip_whitespace=True) = Field(description='Service name')
    description: str | None = Field(description='Description of service name', default='')


class CreateKubernetesResourceServiceBodySchema(CreateServiceBodyBaseSchema):
    """
    Kubernetes resouce service create request body.
    """
    health_check_settings: KubernetesResourceHealthCheckSettingsSchema = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.kubernetes_ingress] | Literal[ServiceTypes.kubernetes_service] = Field(
        description='Type of service'
    )


class CreateHTTPEndpointServiceBodySchema(CreateServiceBodyBaseSchema):
    """
    Simple HTTP endpoint service create request body.
    """
    health_check_settings: HTTPEndpointHealthCheckSettingsSchema = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.http_endpoint] = Field(description='Type of service')


CreateServiceBodySchema = Annotated[
    CreateHTTPEndpointServiceBodySchema | CreateKubernetesResourceServiceBodySchema,
    Field(discriminator='type')
]


class CreatorSchema(BaseModel):
    """
    User that have created service.
    """
    id: UUID = Field(description='User ID')
    email: str = Field(description='User email')
    is_active: bool = Field(description='Is user currently active')
    is_verified: bool = Field(description='Was user email verified')

    class Config:
        orm_mode = True


class OrganizationSchema(BaseModel):
    """
    The organization that owns the service.
    """
    id: int = Field(description='Organization ID')
    title: str = Field(description='Organization title')

    class Config:
        orm_mode = True


class ServiceSchema(BaseModel):
    """
    Service schema.
    """
    id: int = Field(description='Service ID')
    name: str = Field(description='Service name')
    description: str | None = Field(description='Service description')
    health_check_settings: dict = Field(description='Setting related to service heath cheking')
    type: ServiceTypes = Field(description='Type of the service')
    creator: CreatorSchema = Field(description='User that have created this this service')
    organization: OrganizationSchema = Field(description='Organization which own this service')

    class Config:
        orm_mode = True
