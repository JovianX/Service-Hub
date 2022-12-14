"""
Helm related API schemas.
"""
from datetime import datetime

from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl
from pydantic import PositiveInt
from pydantic import constr

from constants.helm import ReleaseHealthStatuses
from constants.helm import ReleaseStatuses
from constants.kubernetes import K8sKinds
from schemas.common_types import K8sSubdomainNameString


class AddHelmRepositoryBodySchema(BaseModel):
    """
    Request body of add Helm repository endpoint.
    """
    name: constr(min_length=3, strip_whitespace=True) = Field(description='Repository name.', example='bitnami')
    url: HttpUrl = Field(description='Repository URL.', example='https://charts.bitnami.com/bitnami')


class InstallChartBodySchema(BaseModel):
    """
    Request body of install Helm chart endpoint.
    """
    context_name: K8sSubdomainNameString = Field(description='Name of context to use during chart installation')
    namespace: K8sSubdomainNameString = Field(description='Name of namespace in which chart should be installed')
    release_name: K8sSubdomainNameString = Field(description='Name of release')
    chart_name: str = Field(description='Name of chart to install')
    values: dict | None = Field(
        description='Values with which Helm chart template should be rendered',
        default_factory=dict
    )
    version: str | None = Field(description='Specific chart version to install')
    description: str | None = Field(description='Description of release')
    dry_run: bool | None = Field(description='If `True` chart installation will be simulated', default=False)


class ReleaseUpdateRequestSchema(BaseModel):
    """
    Body of request for update release values.
    """
    context_name: str = Field(description='Name of context where updating release is located')
    namespase: str = Field(description='Name of namespace where updating release is located')
    chart_name: str | None = Field(
        description='Name of the chart to use during update. If omitted, chart will be recreated from release'
    )
    values: dict = Field(description='Mapping of release values')
    dry_run: bool | None = Field(description='If `True` release updating will be simulated', default=False)


class ReleaseRollbackRequestSchema(BaseModel):
    """
    Body of request for rollback release revision.
    """
    context_name: str = Field(description='Name of context where release is located.')
    namespase: str = Field(description='Name of namespace where release is located.')
    revision: int | None = Field(description='Revision number.')
    dry_run: bool | None = Field(description='If `True` release updating will be simulated', default=False)


class SetReleaseTTLRequestSchema(BaseModel):
    """
    Body of request for update release values.
    """
    context_name: str = Field(description='Name of context where release is located')
    namespase: str = Field(description='Name of namespace where release is located')
    minutes: PositiveInt = Field(description='Release TTL in minutes', default=1)


class ReleaseHealthStatusResponseBodySchema(BaseModel):
    """
    Response body of release entities health status endpoint.
    """
    status: ReleaseHealthStatuses = Field(description='Release health status')
    details: dict[K8sKinds, dict[str, bool]] = Field(
        description='Release detailed description of release entities health condition, grouped by `kind`'
    )


class ChartDumpResponseSchema(BaseModel):
    filename: str = Field(description='Archive filename')
    archive: bytes = Field(description='Archive content encoded in base64')


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
    application_name: str = Field(description='Application name')
    application_version: str = Field(description='Application version')
    chart_version: str = Field(description='Used chart version')
    chart: str = Field(description='Used chart name')
    name: str = Field(description='Release name')
    namespace: str = Field(description='Namespace')
    revision: str = Field(description='Revision number')
    status: ReleaseStatuses = Field(description='Status')
    updated: datetime = Field(description='Release last update date')
    context_name: str = Field(description='Kubernetes configuration context name with which was accessed release')

    class Config:
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }


class ChartListItemSchema(BaseModel):
    """
    Chart list item schema.
    """
    application_name: str = Field(description='Name chart application')
    application_version: str = Field(description='Version of application deployed by chart')
    name: str = Field(description='Chart name')
    version: str = Field(description='Chart version')
    repository_name: str = Field(description='Repository name')
    description: str = Field(description='Chart description')

    class Config:
        orm_mode = True


class ReleaseTTLResponseSchema(BaseModel):
    """
    Release TTL response body.
    """
    scheduled_time: datetime | None = Field(description='Release scheduled removal time')

    class Config:
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }
