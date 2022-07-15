"""
Request and response schemas for API v1.
"""
from datetime import datetime

from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl
from pydantic import constr
from pydantic import root_validator

from application.constants.helm import ReleaseHealthStatuses
from application.constants.helm import ReleaseStatuses
from application.constants.kubernetes import K8sKinds
from application.schemas.common_types import K8sSubdomainNameString


class AddHelmRepositoryBodySchema(BaseModel):
    """
    Request body of add Helm repository endpoint.
    """
    name: constr(min_length=3, strip_whitespace=True) = Field(description='Repository name.', example='nginx-stable')
    url: HttpUrl = Field(description='Repository URL.', example='https://helm.nginx.com/stable')


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


class ReleaseHealthStatusResponseBodySchema(BaseModel):
    """
    Response body of release entities health status endpoint.
    """
    status: ReleaseHealthStatuses = Field(description='Release health status')
    details: dict[K8sKinds, dict[str, bool]] = Field(
        description='Release detailed description of release entities health condition, grouped by `kind`'
    )


class ReleaseListItemAvailableChart(BaseModel):
    """
    Information about chart that can be used for release upgrade.
    """
    chart_name: str = Field(description='Chart name')
    chart_version: str = Field(description='Version of chart')


class ReleaseListItemSchema(BaseModel):
    """
    Helm release list item.
    """
    application_version: str = Field(description='Application version')
    chart_version: str = Field(description='Used chart version')
    chart: str = Field(description='Used chart name')
    name: str = Field(description='Release name')
    namespace: str = Field(description='Namespace')
    revision: str = Field(description='Revision number')
    status: ReleaseStatuses = Field(description='Status')
    updated: datetime = Field(description='Release last update date')
    context_name: str = Field(description='Kubernetes configuration context name with which was accessed release')
    available_chart: ReleaseListItemAvailableChart | None = Field(description='Release chart update candidate')

    @root_validator(pre=True)
    def extract_chart_version(cls, values: dict) -> dict:
        """
        Helm don't returns chart name in CLI output, but we can extract it from
        chart name.
        """
        *_, chart_version = values['chart'].split('-')
        values['chart_version'] = chart_version

        return values

    class Config:
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }
