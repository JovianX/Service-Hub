"""
Applications related API schemas.
"""
from pydantic import BaseModel
from pydantic import Field


class InstallRequestBodySchema(BaseModel):
    """
    Body of request for application installation from specific template.
    """
    template_id: int = Field(description='Identifier of template from which application should be installed')
    inputs: dict = Field(description='Inputs provided by user')
    context_name: str = Field(description='Kubernetes configuration context name')
    namespace: str = Field(description='Name of namespace where to install application')
    dry_run: bool | None = Field(
        description='If `True` application installation will be simulated',
        default=False
    )
