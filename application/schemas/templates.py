"""
Templates schemas.
"""
from collections import Counter

from pydantic import BaseModel
from pydantic import Field
from pydantic import conlist
from pydantic import constr
from pydantic import Extra
from pydantic import root_validator

from application.constants.templates import InputTypes
from application.exceptions.templates import InvalidTemplateException


class Chart(BaseModel):
    """
    Chart schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(description='Helm release name', example='vault')
    chart: constr(min_length=1, strip_whitespace=True) = Field(
        description='Helm chart name',
        example='roboll/vault-secret-manager'
    )
    version: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='Helm chart version',
        example='1.24.1'
    )
    values: list[dict] = Field(
        description='Helm values that will be provided during chart install/upgrade. The later element in the list has '
                    'a higher priority.',
    )

    class Config:
        extra = Extra.forbid


class Input(BaseModel):
    """
    Input from user.
    """
    type: InputTypes = Field(description='Type of input on form', example=InputTypes.string)
    name: constr(min_length=1, strip_whitespace=True) = Field(
        description='Name of value that will be used in template',
        example='username'
    )
    label: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='User friendly name of input', example='User Name'
    )
    default: str | int | float | bool | None = Field(
        description='Default value of input if it was not provided by user', example='root'
    )
    immutable: bool | None = Field(description='If `True`, value cannot be changed', default=False)

    class Config:
        extra = Extra.forbid


class TemplateSchema(BaseModel):
    """
    Template schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(
        description='Name of application which describes this template',
        example='My Application'
    )
    charts: conlist(Chart, min_items=1) = Field(description='Charts that should be deployed by this template')
    inputs: list[Input] | None = Field(description='Input that should be provided by user.', default=[])

    class Config:
        extra = Extra.forbid

    @root_validator(skip_on_failure=True)
    def ensure_chart_names_unique(cls, values: dict) -> dict:
        """
        Ensures that all charts have unique names.
        """
        charts = values['charts']
        chart_names = [chart.name for chart in charts]
        duplicate_names = [name for name, count in Counter(chart_names).items() if count > 1]
        if duplicate_names:
            raise InvalidTemplateException(f'Template charts have dublicate name(s): {", ".join(duplicate_names)}')

        return values

    @root_validator(skip_on_failure=True)
    def ensure_input_names_unique(cls, values: dict) -> dict:
        """
        Ensures that all inputs have unique names.
        """
        inputs = values.get('inputs', [])
        input_names = [input.name for input in inputs]
        duplicate_names = [name for name, count in Counter(input_names).items() if count > 1]
        if duplicate_names:
            raise InvalidTemplateException(f'Template inputs have dublicate name(s): {", ".join(duplicate_names)}')

        return values

    @property
    def chart_mapping(self) -> dict[str, Chart]:
        """
        Mapping of chart release name and chart itself.
        """
        return {chart.name: chart for chart in self.charts}

    @property
    def inputs_mapping(self) -> dict[str, Input]:
        """
        Mapping of input placeholder name and input itself.
        """
        return {item.name: item for item in self.inputs}
