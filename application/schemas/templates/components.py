"""
Template component schemas.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import constr

from constants.templates import ComponentTypes


class Component(BaseModel):
    """
    Application component schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(description='Helm release name', example='vault')
    type: ComponentTypes = Field(description='Type of applicatoin component.', example=ComponentTypes.helm_chart)
    chart: constr(min_length=1, strip_whitespace=True) = Field(
        description='Helm chart name.',
        example='roboll/vault-secret-manager'
    )
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
