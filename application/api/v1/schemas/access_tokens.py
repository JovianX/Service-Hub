"""
User access token related API schemas.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field
from pydantic import validator

from constants.access_tokens import AccessTokenStatuses
from schemas.access_tokens import AccessTokenBaseSchema

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class SetExpirationDateSchema(BaseModel):
    """
    Request body for changing user access token expiration date.
    """
    expiration_date: datetime | None = Field(description='Date and time when token must become expired.')

    @validator('expiration_date')
    def expiration_date_validation(cls, value) -> datetime:
        """
        Converts to UTC and then validates expiration date.
        """
        if value is None:
            return

        # Making time naive(local).
        value = value.astimezone(None).replace(tzinfo=None)
        if value <= datetime.now():
            raise ValueError('Expiration date can not be in past.')

        return value


class CreateSchema(SetExpirationDateSchema):
    """
    User invitation create request schema.
    """
    comment: str | None = Field(description='Description of token.')


class AccessTokenResponseSchema(AccessTokenBaseSchema):
    """
    User access token response schema.
    """
    user: UserResponseSchema = Field(description='User that can use this token for access.')
    organization: OrganizationResponseSchema = Field(description='Organization which own this access token.')

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }


class SetStatusSchema(BaseModel):
    """
    Request body for changing user access token status.
    """
    status: AccessTokenStatuses = Field(description='New user access token status.')


class SetCommentSchema(BaseModel):
    """
    Request body for changing user access token description.
    """
    comment: str | None = Field(description='Description of token.')
