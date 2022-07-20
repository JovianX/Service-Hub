"""
Templates schemas.
"""
from typing import Any

from pydantic import BaseModel
from pydantic import Field
from pydantic import conlist
from pydantic import constr

from application.constants.templates import InputTypes


class Chart(BaseModel):
    """
    Manifest chart schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(description='Helm release name', example='vault')
    chart: constr(min_length=1, strip_whitespace=True) = Field(
        description='Helm chart name',
        example='roboll/vault-secret-manager'
    )
    version: constr(min_length=1, strip_whitespace=True) = Field(
        description='Helm chart version',
        example='1.24.1'
    )


class Input(BaseModel):
    """
    Input from user.
    """
    type: InputTypes = Field(description='Type of input on form', example=InputTypes.string)
    name: constr(min_length=1, strip_whitespace=True) = Field(
        description='Name of Helm value that will contain value of input',
        example='username'
    )
    lable: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='User friendly name of input', example='User Name'
    )
    default: Any | None = Field(
        description='Default value of input if it was not provided by user', example='root'
    )


class TemplateManifestSchema(BaseModel):
    """
    Template manifest schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(
        description='Name of application which describes this template',
        example='My Application'
    )
    charts: conlist(Chart, min_items=1) = Field(description='Charts that should be deployed by this template')
    imputs: conlist(Input, min_items=1) = Field(description='Input that should be provided by user.')
