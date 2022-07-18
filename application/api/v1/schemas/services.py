"""
Request and response schemas for API v1.
"""
from typing import Annotated
from typing import Literal

from pydantic import BaseModel
from pydantic import Field
from pydantic import constr

from application.constants.services import ServiceTypes
from application.managers.services.schemas import HTTPEndpointHealthCheckSettingsSchema
from application.managers.services.schemas import KubernetesIngressHealthCheckSettingsSchema
from application.managers.services.schemas import KubernetesServiceHealthCheckSettingsSchema

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class CreateServiceBodyBaseSchema(BaseModel):
    """
    Body of request for service creation from service catalog.
    """
    name: constr(min_length=3, strip_whitespace=True) = Field(description='Service name')
    description: str | None = Field(description='Description of service name', default='')


class CreateKubernetesIngressServiceBodySchema(CreateServiceBodyBaseSchema):
    """
    Kubernetes ingress resouce service create request body.
    """
    health_check_settings: KubernetesIngressHealthCheckSettingsSchema = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.kubernetes_ingress] = Field(description='Type of service')


class CreateKubernetesServiceServiceBodySchema(CreateServiceBodyBaseSchema):
    """
    Kubernetes service resouce service create request body.
    """
    health_check_settings: KubernetesServiceHealthCheckSettingsSchema = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.kubernetes_service] = Field(description='Type of service')


class CreateHTTPEndpointServiceBodySchema(CreateServiceBodyBaseSchema):
    """
    Simple HTTP endpoint service create request body.
    """
    health_check_settings: HTTPEndpointHealthCheckSettingsSchema = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.http_endpoint] = Field(description='Type of service')


CreateServiceBodySchema = Annotated[CreateHTTPEndpointServiceBodySchema |
                                    CreateKubernetesIngressServiceBodySchema |
                                    CreateKubernetesServiceServiceBodySchema,
                                    Field(discriminator='type')]


class ServiceSchema(BaseModel):
    """
    Service schema.
    """
    id: int = Field(description='Service ID')
    name: str = Field(description='Service name')
    description: str | None = Field(description='Service description')
    health_check_settings: dict = Field(description='Setting related to service heath cheking')
    type: ServiceTypes = Field(description='Type of the service')
    creator: UserResponseSchema = Field(description='User that have created this this service')
    organization: OrganizationResponseSchema = Field(description='Organization which own this service')

    class Config:
        orm_mode = True
