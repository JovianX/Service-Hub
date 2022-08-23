"""
User invitations related API schemas.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import Field
from pydantic import NonNegativeInt
from pydantic import root_validator

from constants.invitations import InvitationStatuses
from utils.invitation import is_invitation_expired

from .common import OrganizationResponseSchema
from .common import UserResponseSchema


class CreateSchema(BaseModel):
    """
    User invitation create request schema.
    """
    email: EmailStr = Field(description='E-mail of the invitee')
    expiration_period: NonNegativeInt | None = Field(
        description='Hours after which invitaitons expires. If set to 0 invitation never expires',
        default=24
    )


class UseSchema(BaseModel):
    """
    User registration by invitation request schema.
    """
    password: str = Field(description='User password.')


class InvitationResponseSchema(BaseModel):
    """
    User registration by invitation request schema.
    """
    id: UUID = Field(description='User invitation ID')
    created_at: datetime = Field(description='Date and time of invitation creation in timestamp format')
    email: EmailStr = Field(description='E-mail of the invitee')
    status: InvitationStatuses = Field(description='Status of invitation')
    expiration_period: NonNegativeInt = Field(description='Invitation expiration period in hours')
    is_expired: bool = Field(description='Invitation expired or not')
    creator: UserResponseSchema = Field(description='User that have created this invitation')
    organization: OrganizationResponseSchema = Field(description='Organization which own this invitation')

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }

    @root_validator(pre=True)
    def set_is_expired(cls, values: dict) -> dict:
        """
        Sets invitation expiration flag.
        """
        created_at = values.get('created_at')
        expiration_period = values.get('expiration_period')
        if not (created_at is None or expiration_period is None):
            values = dict(values)
            values['is_expired'] = is_invitation_expired(created_at, expiration_period)

        return values
