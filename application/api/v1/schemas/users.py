from pydantic import BaseModel
from pydantic import Field

from constants.roles import Roles


class SetUserRoleRequestSchema(BaseModel):
    """
    Change user role request schema.
    """
    user_id: str = Field(description='ID of user role of which is being set.')
    role: Roles = Field(description='Role that should be set.')
