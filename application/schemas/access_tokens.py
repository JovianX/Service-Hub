from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field

from constants.access_tokens import AccessTokenStatuses


class AccessTokenBaseSchema(BaseModel):
    id: UUID = Field(description='Access token itself.')
    created_at: datetime = Field(description='Token creation date and time.')
    status: AccessTokenStatuses = Field(description='Token status.')
    comment: str = Field(description='Token description.')
    expiration_date: datetime | None = Field(description='Date when token expires.')

    class Config:
        extra = Extra.forbid
        orm_mode = True


class AccessTokenSchema(BaseModel):
    user_id: UUID = Field(description='ID of user which token represents.')
    creator_id: UUID = Field(description='ID of user who have created this token.')
    organization_id: int = Field(description='ID of organization to which token belongs.')

    class Config:
        extra = Extra.forbid
        orm_mode = True
