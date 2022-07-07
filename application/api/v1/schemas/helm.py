"""
Request and response schemas for API v1.
"""
from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl
from pydantic import constr

from application.schemas.common_types import K8sSubdomainNameString


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
    context_name: K8sSubdomainNameString = Field(description='Name of context to use during chart installation')
    namespace: K8sSubdomainNameString = Field(description='Name of namespace in which chart should be installed')
    release_name: K8sSubdomainNameString = Field(description='Name of release')
    chart_name: str = Field(description='Name of chart to install')
    values: dict = Field(description='Values with which Helm chart template should be rendered')
    description: str | None = Field(description='Description of release')
