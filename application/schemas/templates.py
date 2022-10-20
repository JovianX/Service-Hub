"""
Templates schemas.
"""
from collections import Counter
from typing import Annotated
from typing import Any
from typing import Literal

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import conlist
from pydantic import constr
from pydantic import root_validator
from pydantic import validator

from constants.templates import ComponentTypes
from constants.templates import InputTypes


def unique_names(items: list) -> dict:
    """
    Ensures that all items have unique names.
    """
    chart_names = [item.name for item in items]
    duplicate_names = [name for name, count in Counter(chart_names).items() if count > 1]
    if duplicate_names:
        raise ValueError(f'Dublicating name(s) found: {", ".join(duplicate_names)}')

    return items


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


class BaseInput(BaseModel):
    """
    Input from user.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(
        description='Name of value that will be used in template.',
        example='username'
    )
    type: InputTypes = Field(description='Type of form input.', example=InputTypes.text)
    label: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='User friendly name of input.', example='User Name'
    )
    default: str | int | float | bool | None = Field(
        description='Default value of input if it was not provided by user.', example='root'
    )
    immutable: bool | None = Field(description='If `True`, value cannot be changed.', default=False)
    description: str | None = Field(description='Input help text for user.')

    class Config:
        extra = Extra.forbid


class BooleanInput(BaseInput):
    """
    User inputs which value can be only True or False.
    """
    type: Literal[InputTypes.checkbox] | Literal[InputTypes.switch] = Field(
        description='Type of form input.', example=Literal[InputTypes.checkbox]
    )
    default: bool | None = Field(description='Default value of input if it was not provided by user.', example=True)


class InputOption(BaseModel):
    """
    Input option schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(
        description='Option name.',
        example='option_a'
    )
    value: Any = Field(
        description='Value of option that will put into template dynamic variable.', example='option_a_value'
    )
    label: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='User friendly name of option.', example='Option 1'
    )
    description: str | None = Field(description='Option help text for user.')


class ChoiceInput(BaseInput):
    """
    User inputs where user can choose one option from predefined set.
    """
    type: Literal[InputTypes.select] = Field(description='Type of form input.', example=Literal[InputTypes.select])
    options: conlist(InputOption, min_items=2) = Field(description='Set of input options.')
    default: str | None = Field(
        description='Default value of input if it was not provided by user.', example='option_value_1'
    )

    _unique_options = validator('options', allow_reuse=True)(unique_names)

    @root_validator(skip_on_failure=True)
    def ensure_default_in_options(cls, values: dict) -> dict:
        """
        Ensures that default value is present in options list.
        """
        default = values.get('default')
        if default:
            options = values['options']
            option_names = [option.name for option in options]
            if default not in option_names:
                raise ValueError(f'Default value "{default}" is not in options list: {option_names}.')

        return values

    @property
    def options_mapping(self) -> dict[str, BaseInput]:
        """
        Mapping of input option name and input itself.
        """
        return {item.name: item for item in self.options}


class NumericInput(BaseInput):
    """
    User inputs where user can set only integer or float.
    """
    type: Literal[InputTypes.slider] | Literal[InputTypes.number] = Field(
        description='Type of form input.', example=Literal[InputTypes.number]
    )
    min: int | float | None = Field(description='Minimal possible input value.', example=1)
    max: int | float | None = Field(description='Maximal possible input value.', example=10)
    default: int | float | None = Field(description='Default value of input if it was not provided by user.', example=5)

    @root_validator(skip_on_failure=True)
    def ensure_default_in_range(cls, values: dict) -> dict:
        """
        Ensures that default value is in range between min and max values.
        """
        default = values.get('default')
        min = values.get('min')
        max = values.get('max')
        if default is not None and min is not None:
            if default < min:
                raise ValueError(f'Default value "{default}" must be greater or equal min value {min}.')
        if default is not None and max is not None:
            if default > max:
                raise ValueError(f'Default value "{default}" must be less or equal min value {min}.')

        return values


class TextualInput(BaseInput):
    """
    User inputs where user can choose one or more option from predefined set.
    """
    type: Literal[InputTypes.text] | Literal[InputTypes.textarea] = Field(
        description='Type of form input.', example=Literal[InputTypes.text]
    )
    default: str | None = Field(
        description='Default value of input if it was not provided by user.', example='some default text'
    )


class CheckboxInput(BooleanInput):
    """
    Input with checkbox widget.
    """
    type: Literal[InputTypes.checkbox] = Field(description='Type of form input.', example=InputTypes.checkbox)


class SwitchInput(BooleanInput):
    """
    Input with toggle widget.
    """
    type: Literal[InputTypes.switch] = Field(description='Type of form input.', example=InputTypes.switch)


class SelectInput(ChoiceInput):
    """
    Inputs where user can choose one option from dropdown list widget.
    """
    type: Literal[InputTypes.select] = Field(description='Type of form input.', example=InputTypes.select)


class RadioSelectInput(ChoiceInput):
    """
    Inputs where user can choose one option by clicking on radio button of radio
    select widget.
    """
    type: Literal[InputTypes.radio_select] = Field(description='Type of form input.', example=InputTypes.radio_select)


class NumberInputs(NumericInput):
    """
    Inputs where user can set only integer or float in text field.
    """
    type: Literal[InputTypes.number] = Field(description='Type of form input.', example=InputTypes.number)


class SliderInput(NumericInput):
    """
    Inputs where user can set number by moving slider pointer.
    """
    type: Literal[InputTypes.slider] = Field(description='Type of form input.', example=InputTypes.slider)
    min: int | float = Field(description='Minimal possible input value.', example=1)
    max: int | float = Field(description='Maximal possible input value.', example=10)
    step: int | float = Field(description='Step of slider pointer.', example=0.5)


class TextInput(TextualInput):
    """
    User inputs where user can choose one or more option from predefined set.
    """
    type: Literal[InputTypes.text] = Field(description='Type of form input.', example=InputTypes.text)


class TextareaInput(TextualInput):
    """
    User inputs where user can choose one or more option from predefined set.
    """
    type: Literal[InputTypes.textarea] = Field(description='Type of form input.', example=InputTypes.textarea)


Input = Annotated[CheckboxInput |
                  NumberInputs |
                  RadioSelectInput |
                  SelectInput |
                  SliderInput |
                  SwitchInput |
                  TextareaInput |
                  TextInput,
                  Field(discriminator='type')]


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
    def inputs_mapping(self) -> dict[str, BaseInput]:
        """
        Mapping of input placeholder name and input itself.
        """
        return {item.name: item for item in self.inputs}
