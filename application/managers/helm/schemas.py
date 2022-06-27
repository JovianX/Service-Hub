from datetime import datetime
from typing import List

from pydantic import BaseModel
from pydantic import Field

from application.constants.helm import ReleaseHealthStatuses
from application.constants.helm import ReleaseStatuses


class ReleaseListItemSchema(BaseModel):
    """
    Helm release list item.
    """
    application_version: str = Field(description='Application version')
    chart: str = Field(description='Used chart name')
    name: str = Field(description='Release name')
    namespace: str = Field(description='Namespace')
    revision: str = Field(description='Revision number')
    status: ReleaseStatuses = Field(description='Status')
    updated: datetime = Field(description='Release last update date')
    health_status: ReleaseHealthStatuses = Field(description='Release health status')
    entities_health_status: dict = Field(description='Release detailed description of release health condition')
    cluster: str = Field(description='Kubernetes configuration context name')

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
