from enum import Enum
from typing import Union

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field

from models.organization import Organization


class SettingsSchema(BaseModel):
    application_ttl: int | None = Field(description='Default application TTL in minutes.')

    class Config:
        extra = Extra.forbid

    @classmethod
    def from_organization(cls, organization: Organization) -> 'SettingsSchema':
        """
        Helper to get settings from organization model.
        """
        return cls.parse_obj(organization.settings)


ROOT_SETTING_NAMES = Enum(
    'SettingNames',
    {field_name: field_name for field_name in SettingsSchema.__fields__.keys()},
    type=str
)


ROOT_SETTING_SCHEMAS = Union[  # type: ignore
    tuple(field.type_ for field in SettingsSchema.__fields__.values())
]
