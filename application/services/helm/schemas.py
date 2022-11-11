"""
Helm schemas.
"""
import re
from datetime import datetime
from datetime import timedelta
from datetime import timezone

from pydantic import BaseModel
from pydantic import Field
from pydantic import root_validator

from constants.helm import ReleaseStatuses


# Helm date formats patters.
UTC_TIME_FORMAT = re.compile(
    r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2}) '
    r'(?P<hour>\d{2}):(?P<minute>\d{2}):(?P<second>\d{2}).(?P<microsecond>\d{6})\d* (?P<utc_offset>[+-]\d{4}).*'
)
ZULU_TIME_FORMAT = re.compile(
    r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})'
    r'T(?P<hour>\d{2}):(?P<minute>\d{2}):(?P<second>\d{2}).(?P<microsecond>\d{6})\d*Z'
)


class helm_datetime(datetime):
    @classmethod
    def __get_validators__(cls):
        yield cls.parse_datetime

    @classmethod
    def parse_datetime(cls, value: str) -> datetime:
        """
        Parses date time that sends us helm.

        Helm is production ready crap so you can meet next date formats:
            UTC:
                '2022-06-01 12:46:15.24955073 +0000 UTC'
                '2022-06-07 16:13:40.907107 +0300 +0300'
                '2022-05-04 17:09:15.459564582 +0200 CEST'
            Zulu:
                '2022-11-03T15:00:34.133003395Z'
        """
        if isinstance(value, datetime):
            # During rendering we trying to parse same instance of datetime again.
            return value

        if (match := UTC_TIME_FORMAT.search(value)) is not None:
            utc_time = match.groupdict()

            # Converting UTC offset to seconds.
            sign = utc_time['utc_offset'][:1]
            hour = int(utc_time['utc_offset'][1:3])
            minute = int(utc_time['utc_offset'][3:5])
            seconds = (hour * 3600) + (minute * 60)

            return datetime(
                year=int(utc_time['year']),
                month=int(utc_time['month']),
                day=int(utc_time['day']),
                hour=int(utc_time['hour']),
                minute=int(utc_time['minute']),
                second=int(utc_time['second']),
                microsecond=int(utc_time['microsecond']),
                tzinfo=timezone(timedelta(seconds=int(f'{sign}{seconds}')))
            )
        elif (match := ZULU_TIME_FORMAT.search(value)) is not None:
            utc_time = match.groupdict()

            return datetime(
                year=int(utc_time['year']),
                month=int(utc_time['month']),
                day=int(utc_time['day']),
                hour=int(utc_time['hour']),
                minute=int(utc_time['minute']),
                second=int(utc_time['second']),
                microsecond=int(utc_time['microsecond']),
                tzinfo=timezone.utc
            )
        else:
            raise ValueError(f'Failed to recognize Helm date time format for: "{value}".')


def parse_chart_name(cls, values: dict) -> dict:
    """
    Root validator that extracts application name and chart version from chart
    name.
    Schema must have `chart` attribute as source and value of this attribute
    must have next format: `<application-name>-<version>`. For instance:
    `mongodb-13.4.1`.
    Schema also must have `application_name` and `chart_version` fields.
    """
    chart_name = values.get('chart')
    if not chart_name:
        raise ValueError(f'No chart name was provided.')
    *splited_name, chart_version = chart_name.split('-')
    values['application_name'] = '-'.join(splited_name)
    values['chart_version'] = chart_version

    return values


class ReleaseSchema(BaseModel):
    """
    Helm release response.
    """
    application_name: str = Field(description='Application name')
    application_version: str = Field(alias='app_version', description='Application version')
    chart: str = Field(description='Used chart name')
    chart_version: str = Field(description='Used chart version')
    name: str = Field(description='Release name')
    namespace: str = Field(description='Namespace')
    revision: str = Field(description='Revision number')
    status: ReleaseStatuses = Field(description='Status')
    updated: helm_datetime = Field(description='Release last deploy date')

    class Config:
        allow_population_by_field_name = True

    _parse_chart = root_validator(pre=True, skip_on_failure=True, allow_reuse=True)(parse_chart_name)


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
    application_name: str = Field(description='Name of chart application')
    application_version: str = Field(alias='app_version', description='Version of application deployed by chart')
    name: str = Field(description='Chart name')
    version: str = Field(description='Chart version')
    repository_name: str = Field(description='Name of repository where chart is stored')
    description: str = Field(description='Chart description')

    class Config:
        allow_population_by_field_name = True

    @root_validator(pre=True, skip_on_failure=True)
    def parse_chart_name(cls, values: dict) -> dict:
        """
        Extracts repository and application name from chart name.
        """
        name = values.get('name')
        if not name:
            raise ValueError(f'No chart name was provided.')
        repository_name, application_name = name.split('/')
        if not repository_name:
            raise ValueError(f'Failed to extract repository name from chart name: "{name}".')
        if not application_name:
            raise ValueError(f'Failed to extract application name from chart name: "{name}".')
        values['repository_name'] = repository_name
        values['application_name'] = application_name

        return values

    def dict(self, *args, **kwargs):
        kwargs['by_alias'] = False
        return super().dict(*args, **kwargs)


class ReleaseRevisionSchema(BaseModel):
    """
    Helm release revision schema.
    """
    application_name: str = Field(description='Application name')
    application_version: str = Field(
        description='Version of application deployed with this release.',
        alias='app_version'
    )
    chart: str = Field(description='Chart name and version.')
    chart_version: str = Field(description='Used chart version')
    revision: int = Field(description='Release revision.')
    status: ReleaseStatuses = Field(description='Release status.')
    description: str = Field(description='Chart description')
    updated: helm_datetime = Field(description='Release last deploy date.')

    _parse_chart = root_validator(pre=True, skip_on_failure=True, allow_reuse=True)(parse_chart_name)

    class Config:
        json_encoders = {
            datetime: lambda v: v.timestamp(),
        }
