"""
Helm schemas.
"""
from datetime import datetime
from datetime import timezone

from pydantic import BaseModel
from pydantic import Field

from application.constants.helm import ReleaseStatuses


class helm_datetime(datetime):
    @classmethod
    def __get_validators__(cls):
        yield cls.parse_datetime

    @classmethod
    def parse_datetime(cls, value: str) -> datetime:
        """
        Parses date time that sends us helm.

        Values example: '2022-06-01 12:46:15.24955073 +0000 UTC'
                        '2022-06-07 16:13:40.907107 +0300 +0300'
        """
        # Reducing microseconds count to 6 by cutting redundant digits.
        # Helm returns time with 8 digits in microseconds Python supports only 6.
        date_parts = list(value.split())
        date_parts[1] = date_parts[1][:15]
        # Removing time zone. Sometimes date contains Time zone as UTC sometimes
        # as +0300. It breaks parsing of date.
        fixed_value = ' '.join(date_parts[:-1])

        parsed_datetime = datetime.strptime(fixed_value, '%Y-%m-%d %H:%M:%S.%f %z')
        # Setting UTC time zone manually.
        parsed_datetime.replace(tzinfo=timezone.utc)
        return parsed_datetime


class ReleaseSchema(BaseModel):
    """
    Helm release response.
    """
    application_version: str = Field(alias='app_version', description='Application version')
    chart: str = Field(description='Used chart name')
    name: str = Field(description='Release name')
    namespace: str = Field(description='Namespace')
    revision: str = Field(description='Revision number')
    status: ReleaseStatuses = Field(description='Status')
    updated: helm_datetime = Field(description='Release last update date')

    class Config:
        allow_population_by_field_name = True

    @property
    def chart_name(self) -> str:
        """
        Extracted Helm chart name.
        """
        *splited_name, chart_version = self.chart.split('-')

        return '-'.join(splited_name)

    @property
    def chart_version(self) -> str:
        """
        Extracted Helm chart name.
        """
        *splited_name, chart_version = self.chart.split('-')

        return chart_version


class ManifestMetaSchema(BaseModel):
    name: str = Field(description='Entity name')
    namespace: str | None = Field(description='Namespace to which belongs entity')
    labels: dict | None = Field(default={}, description='Custom defined labels in form key-value')


class ManifestSchema(BaseModel):
    """
    Entity manifest.
    """
    api_version: str = Field(alias='apiVersion', description='API version')
    kind: str = Field(description='Type of entity')
    metadata: ManifestMetaSchema = Field(description='Entity metadata')
    specification: dict | None = Field(alias='spec', default={}, description='Entity technical specification')

    class Config:
        allow_population_by_field_name = True


class ChartSchema(BaseModel):
    """
    Helm chart description.
    """
    application_version: str = Field(alias='app_version', description='Version of application deployed by chart')
    description: str = Field(description='Chart description')
    name: str = Field(description='Chart name')
    version: str = Field(description='Chart version')

    class Config:
        allow_population_by_field_name = True

    @property
    def repository_name(self) -> str:
        """
        Repository name where chart stored.
        """
        repository_name, chart_name = self.name.split('/')

        return repository_name

    @property
    def chart_name(self) -> str:
        """
        Chart name.
        """
        repository_name, chart_name = self.name.split('/')

        return chart_name

    def dict(self, *args, **kwargs):
        kwargs['by_alias'] = True
        return super().dict(*args, **kwargs)
