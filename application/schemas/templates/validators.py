"""
Template validators.
"""
import re
from collections import Counter


VARIABLE_PATTERN = re.compile(r'^{{ *(?P<variable>[a-zA-Z0-9\[\]\.\_\-]+) *}}$')
COMPONENTS_VARIABLE_PATTERN = re.compile(r'^components\.[a-zA-Z0-9-]+\.manifest\.[a-zA-Z0-9\.\[\]_-]+$')
INPUTS_VARIABLE_PATTERN = re.compile(r'^inputs\.[a-zA-Z0-9_-]+$')


def unique_names(items: list) -> dict:
    """
    Ensures that all items have unique names.
    """
    chart_names = [item.name for item in items]
    duplicate_names = [name for name, count in Counter(chart_names).items() if count > 1]
    if duplicate_names:
        raise ValueError(f'Dublicating name(s) found: {", ".join(duplicate_names)}')

    return items


class TemplateVariable(str):
    """
    Template variable validation.

    For now supported next kinds of variables:
    1. `inputs` - this variables contain values provided by user during application deployment. For example we have
                  input that represents amount of space on drive. Let's call it `volume_size`. Duting application
                  deployment user specified for example 50Gb. This means when we are meeting `{{ inputs.volume_size }}`
                  in template during rendering `{{ inputs.volume_size }}` must be replaced by `50Gb`.

    2. `components` - allows template creator to reference to components during template rendering. Have next format:
                      `components.<component name>.manifest.<entity type>.<entity name>.<doted path to attribute>`. For
                      example with next template variable we can reference to cluster IP of deployed Redis component
                      `components.redis.manifest.Service.redis-replicas.spec.cluster_ip`.
    """

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            pattern='^\{\{ *(components\.[a-zA-Z0-9-]+\.manifest\.[a-zA-Z0-9\.\[\]_-]+|inputs\.[a-zA-Z0-9_-]+) *\}\}$',
            examples=['inputs.input_name', 'components.component-name.manifest.Service.some-service.spec.cluster_ip'],
        )

    @classmethod
    def validate(cls, value):
        """
        Template variables validation.
        """
        if not isinstance(value, str):
            raise TypeError('String required.')

        match = VARIABLE_PATTERN.search(value)
        if match is not None:
            template_variable = match.groupdict()['variable']
        else:
            raise ValueError(
                f'Invalid template variable "{value}". Template variable must start from "{{{{" and end with "}}}}"'
            )

        if template_variable.startswith('components'):
            if COMPONENTS_VARIABLE_PATTERN.match(template_variable) is None:
                raise ValueError(
                    f'Invalid components template variable "{template_variable}". Please check spelling and format. '
                    f'Format must be "components.<component name>.manifest.<entity type>.<entity name>.<doted path to '
                    f'attribute>".'
                )
        elif template_variable.startswith('inputs'):
            if INPUTS_VARIABLE_PATTERN.match(template_variable) is None:
                raise ValueError(
                    f'Invalid inputs template variable "{template_variable}". Please check spelling and format. '
                    f'Format must be "inputs.<input name>".'
                )
        else:
            raise ValueError(f'Invalid template variable "{template_variable}".')

        return cls(value)

    def __repr__(self):
        return f'TemplateVariable({super().__repr__()})'
