from enum import Enum
from typing import Any
from typing import Union

from pydantic import BaseModel
from pydantic import Field


class SettingsSchema(BaseModel):
    test_setting: Any | None = Field(description='Temporary test settings. Existing just to have something.')


ROOT_SETTING_NAMES = Enum(
    'SettingNames',
    {field_name: field_name for field_name in SettingsSchema.__fields__.keys()},
    type=str
)


ROOT_SETTING_SCHEMAS = Union[  # type: ignore
    tuple(field.type_ for field in SettingsSchema.__fields__.values())
]
