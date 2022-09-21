"""
Schemas for services from service catalog.
"""
from typing import Any
from typing import Literal

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import HttpUrl

from constants.common import HTTPMethods
from schemas.common_types import K8sSubdomainNameString


class HealthCheckSettingsBaseSchema(BaseModel, extra=Extra.forbid):
    """
    Base settings for Kubernetes resource and HTTP endpoint service health check.
    """
    headers: dict[str, str] | None = Field(description='Request headers with which hit health check endpoint')
    timeout: int | None = Field(description='Health check request timeout in seconds', default=60)


class KubernetesResourceHealthCheckSettingsBaseSchema(HealthCheckSettingsBaseSchema):
    """
    Kubernetes resource service health check settings base.
    """
    method: Literal[HTTPMethods.get] | Literal[HTTPMethods.post] = Field(
        description='Methods to hit health check endpoint'
    )
    path: str = Field(description='Endpoint path.')
    context_name: K8sSubdomainNameString = Field(description='Context name from Kubernetes configuration to use')
    namespace: K8sSubdomainNameString = Field(description='Name of namespace where located resource')


class KubernetesServiceHealthCheckSettingsSchema(KubernetesResourceHealthCheckSettingsBaseSchema):
    """
    Kubernetes service health check settings.
    """
    service_name: K8sSubdomainNameString = Field(description='Name of Kubernetes service resource')


class KubernetesIngressHealthCheckSettingsSchema(KubernetesResourceHealthCheckSettingsBaseSchema):
    """
    Kubernetes ingress health check settings.
    """
    ingress_name: K8sSubdomainNameString = Field(description='Name of Kubernetes ingress resource')


class HTTPEndpointHealthCheckSettingsSchema(HealthCheckSettingsBaseSchema):
    """
    Kubernetes resource service health check settings.
    """
    method: HTTPMethods = Field(description='Methods to hit health check endpoint')
    parameters: dict[str, Any] | None = Field(description='Query parameters with which hit health check endpoint')
    body: dict[str, Any] | None = Field(description='Request body parameters with which hit health check endpoint')
    url: HttpUrl = Field(description='Health check endpoint URL')
