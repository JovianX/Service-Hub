"""
Events related API schemas.
"""

from pydantic import BaseModel
from pydantic import Field


class ObjectIdentifiersQuerySchema(BaseModel):
    """
    Query parameters for filtering event for specific object.
    """
    application_id: int | None = Field(description='ID of application.')
    organization_id: int | None = Field(description='ID of organization.')
    repository_name: str | None = Field(description='Name of Helm repository.')
    context: str | None = Field(description='Name of Kubernetes context.')
    namespace: str | None = Field(description='Name of Kubernetes namespace.')
    release_name: str | None = Field(description='Name of Helm release.')
