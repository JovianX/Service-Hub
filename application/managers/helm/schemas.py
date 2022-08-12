from datetime import datetime
from typing import List

from pydantic import BaseModel
from pydantic import Field
from pydantic import root_validator

from constants.helm import ReleaseHealthStatuses
from constants.helm import ReleaseStatuses


class AvailableChart(BaseModel):
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
    health_status: ReleaseHealthStatuses = Field(description='Release health status')
    entities_health_status: dict = Field(description='Release detailed description of release health condition')
    context_name: str = Field(description='Kubernetes configuration context name with which was accessed release')
    available_chart: AvailableChart | None = Field(description='Release chart update candidate')

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


class ReleaseDetails(BaseModel):
    """
    Release details.
    """
    user_supplied_values: dict = Field(description='Values provided by user to Helm')
    computed_values: dict = Field(description='Final(rendered) values used by Helm')
    hooks: List[dict] = Field(description='Detailed list of hooks entities.')
    manifests: List[dict] = Field(description='Detailed list of Helm release entities')
    notes: str = Field(description='Release notes')
