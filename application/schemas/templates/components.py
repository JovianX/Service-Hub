"""
Template component schemas.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import constr

from constants.templates import ComponentTypes

from .validators import TemplateVariable


class Component(BaseModel):
    """
    Application component schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(description='Helm release name', example='vault')
    type: ComponentTypes = Field(description='Type of applicatoin component.', example=ComponentTypes.helm_chart)
    enabled: bool | TemplateVariable | None = Field(description='Is component must be installed.', default=True)
    chart: constr(min_length=1, strip_whitespace=True) = Field(description='Helm chart name.', example='bitnami/redis')
    version: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='Helm chart version.',
        example='1.24.1'
    )
    values: list[dict] | None = Field(
        description='Helm values that will be provided during chart install/upgrade. The later element in the list has '
                    'a higher priority.',
    )

    class Config:
        extra = Extra.forbid

    def __hash__(self) -> str:
        return hash(self.name)
