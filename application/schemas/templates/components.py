"""
Template component schemas.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import constr
from pydantic import root_validator

from constants.templates import ComponentTypes
from constants.templates import httpDeploy
from constants.templates import httpStatus
from constants.templates import httpDelete

from .validators import TemplateVariable

from typing import Optional

class Component(BaseModel):
    """
    Application component schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(description='Helm release name', example='vault')
    type: ComponentTypes = Field(description='Type of application component.', example=ComponentTypes.helm_chart)
    enabled: bool | TemplateVariable | None = Field(description='Is component must be installed.', default=True)
    chart: constr(min_length=1, strip_whitespace=True) | None = Field(description='Helm chart name.', example='bitnami/redis')
    version: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='Helm chart version.',
        example='1.24.1'
    )
    values: list[dict] | None = Field(
        description='Helm values that will be provided during chart install/upgrade. The later element in the list has '
                    'a higher priority.',
    )

    deploy: Optional[httpDeploy] = Field(description='Deployment details for HTTP type components')
    status: Optional[httpStatus] = Field(description='Status details for HTTP type components')
    delete: Optional[httpDelete] = Field(description='Deletion details for HTTP type components')


    @root_validator(pre=True)
    def check_deploy(cls, values):
        type_ = values.get('type')
        deploy = values.get('deploy')
        delete = values.get('delete')
        if type_ == ComponentTypes.http:
            if deploy is None:
                raise ValueError('deploy is required when type is http')
            if delete is None:
                raise ValueError('delete is required when type is http')
        return values

    def __hash__(self) -> str:
        return hash(self.name)

    class Config:
        extra = Extra.forbid

    def __hash__(self) -> str:
        return hash(self.name)
