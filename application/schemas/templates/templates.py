"""
Templates schemas.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import conlist
from pydantic import constr
from pydantic import validator

from .components import Component
from .inputs import Input
from .validators import unique_names


class TemplateSchema(BaseModel):
    """
    Template schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(
        description='Name of application which describes this template',
        example='My Application'
    )
    components: conlist(Component, min_items=1) = Field(description='Application components.')
    inputs: list[Input] | None = Field(description='Input that should be provided by user.', default=[])

    class Config:
        extra = Extra.forbid

    _unique_components = validator('components', allow_reuse=True)(unique_names)
    _unique_inputs = validator('inputs', allow_reuse=True)(unique_names)

    @property
    def components_mapping(self) -> dict[str, Component]:
        """
        Mapping of application component name and component itself.
        """
        return {chart.name: chart for chart in self.components}

    @property
    def inputs_mapping(self) -> dict[str, Input]:
        """
        Mapping of input placeholder name and input itself.
        """
        return {item.name: item for item in self.inputs}
