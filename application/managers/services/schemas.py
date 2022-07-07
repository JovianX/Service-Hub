"""
Schemas for services from service catalog.
"""
from typing import Any
from typing import Dict

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import HttpUrl

from application.constants.common import HTTPMethods
from application.constants.services import ServiceTypes
from application.schemas.common_types import K8sSubdomainNameString


class HealthCheckSettingsBaseSchema(BaseModel, extra=Extra.forbid):
    """
    Base settings for Kubernetes resource and HTTP endpoint service health check.
    """
    method: HTTPMethods = Field(description='Method to hit health check endpoint')
    parameters: Dict[str, Any] | None = Field(description='Query parameters with which hit health check endpoint')
    body: Dict[str, Any] | None = Field(description='Request body parameters with which hit health check endpoint')
    timeout: int | None = Field(description='Health check request timeout in seconds', default=60)


class KubernetesResourceHealthCheckSettingsSchema(HealthCheckSettingsBaseSchema):
    """
    Kubernetes resource service health check settings.
    """
    path: str = Field(description='Endpoint path.')
    context_name: K8sSubdomainNameString = Field(description='Context name from Kubernetes configuration to use')
    namespace: K8sSubdomainNameString = Field(description='Name of namespace where located resource')
    service_name: K8sSubdomainNameString = Field(description='Name of service resource')


class HTTPEndpointHealthCheckSettingsSchema(HealthCheckSettingsBaseSchema):
    """
    Kubernetes resource service health check settings.
    """
    endpoint: HttpUrl = Field(description='Health check endpoint URL')
