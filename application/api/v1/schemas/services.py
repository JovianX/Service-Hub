"""
Serivce catalog related API schemas.
"""
from typing import Annotated
from typing import Literal

from pydantic import BaseModel
from pydantic import Field
from pydantic import constr
from pydantic import root_validator

from application.constants.services import ServiceTypes
from application.managers.services.schemas import HTTPEndpointHealthCheckSettingsSchema
from application.managers.services.schemas import KubernetesIngressHealthCheckSettingsSchema
from application.managers.services.schemas import KubernetesServiceHealthCheckSettingsSchema

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


################################################################################
# Create schemas
################################################################################


class CreateServiceBodyBaseSchema(BaseModel):
    """
    Body of request for service creation from service catalog.
    """
    name: constr(min_length=3, strip_whitespace=True) = Field(description='Service name')
    description: str | None = Field(description='Description of service', default='')


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


################################################################################
# Update schemas
################################################################################


class UpdateServiceBaseSchema(BaseModel):
    """
    Body of request for updating service in service catalog.
    """
    name: constr(min_length=3, strip_whitespace=True) | None = Field(description='Service name')
    description: str | None = Field(description='Description of service', default='')

    @root_validator(skip_on_failure=True)
    def validate_type_change(cls, values: dict) -> dict:
        """
        Validate that when servce type is going to chang(it present in request)
        health check settings also present in request.
        """
        health_check_settings = values.get('health_check_settings')
        type = values.get('type')
        if type and not health_check_settings:
            raise ValueError('Request must contain health check settings when service type is changing.')

        return values


class UpdateRequestKubernetesIngressServiceSchema(UpdateServiceBaseSchema):
    """
    Kubernetes ingress resouce service update request body.
    """
    health_check_settings: KubernetesIngressHealthCheckSettingsSchema | None = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.kubernetes_ingress] | None = Field(description='Type of service')


class UpdateRequestKubernetesServiceServiceSchema(UpdateServiceBaseSchema):
    """
    Kubernetes service resouce service update request body.
    """
    health_check_settings: KubernetesServiceHealthCheckSettingsSchema | None = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.kubernetes_service] | None = Field(description='Type of service')


class UpdateRequestHTTPEndpointServiceSchema(UpdateServiceBaseSchema):
    """
    Simple HTTP endpoint service update request body.
    """
    health_check_settings: HTTPEndpointHealthCheckSettingsSchema | None = Field(
        description='Settings for service health check.'
    )
    type: Literal[ServiceTypes.http_endpoint] | None = Field(description='Type of service')


UpdateServiceSchema = Annotated[UpdateRequestHTTPEndpointServiceSchema |
                                UpdateRequestKubernetesIngressServiceSchema |
                                UpdateRequestKubernetesServiceServiceSchema,
                                Field(discriminator='type')]


################################################################################
# Response schemas
################################################################################


class ServiceResponseSchema(BaseModel):
    """
    Service schema.
    """
    id: int = Field(description='Service ID')
    name: str = Field(description='Service name')
    description: str | None = Field(description='Service description')
    health_check_settings: dict = Field(description='Setting related to service heath cheking')
    type: ServiceTypes = Field(description='Type of the service')
    creator: UserResponseSchema = Field(description='User that have created this service')
    organization: OrganizationResponseSchema = Field(description='Organization which own this service')

    class Config:
        orm_mode = True
