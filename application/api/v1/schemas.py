"""
Request and response schemas for API v1.
"""
from typing import Optional

from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl
from pydantic import constr

# RFC 1123 compliant string.
k8s_resource = constr(regex=r'[a-z0-9]([-a-z0-9]*[a-z0-9])?')


class AddHelmRepositoryBodySchema(BaseModel):
    """
    Request body of add Helm repository endpoint.
    """
    name: constr(min_length=3, strip_whitespace=True) = Field(description='Repository name.')
    url: HttpUrl = Field(description='Repository URL.')


class InstallChartBodySchema(BaseModel):
    """
    Request body of install Helm chart endpoint.
    """
    context_name: k8s_resource = Field(description='Name of context to use during chart installation')
    namespace: k8s_resource = Field(description='Name of namespace in which chart should be installed')
    release_name: k8s_resource = Field(description='Name of release')
    chart_name: str = Field(description='Name of chart to install')
    values: dict = Field(description='Values with which Helm chart template should be rendered')
    description: Optional[str] = Field(description='Description of release')
