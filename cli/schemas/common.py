"""
Common API schemas.
"""
from uuid import UUID

from pydantic import BaseModel
from pydantic import Field


class UserResponseSchema(BaseModel):
    """
    Common user response schema.
    """
    id: UUID = Field(description='User ID')
    email: str = Field(description='User email')
    is_active: bool = Field(description='Is user currently active')
    is_verified: bool = Field(description='Was user email verified')
    role: str = Field(description='User role')

    class Config:
        orm_mode = True


class OrganizationResponseSchema(BaseModel):
    """
    Common organization response schema.
    """
    id: int = Field(description='Organization ID')
    title: str = Field(description='Organization title')

    class Config:
        orm_mode = True
