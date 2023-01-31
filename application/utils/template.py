"""
Templates related helpers.
"""
import logging
import re

import pystache
import yaml
from pydantic import ValidationError
from pydantic.error_wrappers import display_errors
from yaml import YAMLError

from exceptions.templates import InvalidTemplateException
from exceptions.templates import InvalidUserInputsException
from schemas.templates import TemplateSchema


logger = logging.getLogger(__name__)


START_DELIMITER = re.compile(r'''(?<!['"])\{\{''')
END_DELIMITER = re.compile(r'''\}\}(?!['"])''')
START_DELIMITER_REPLACEMENT = '"{{{'
END_DELIMITER_REPLACEMENT = '}}}"'
PLACEHOLDERS = re.compile(r'.*{{(.*)}}.*')


def make_template_yaml_safe(raw_template: str) -> str:
    """
    Transforms template YAML into valid, by replacing `{{` to `"{{{` and `}}` to
    `}}}"`, to be able to parse it.

    Template can contain placeholders, for instance: `username: {{ username }}`.
    This makes YAML invalid and we unable to parse it. It is fine when user puts
    placeholders in quotes or double quotes, for example:
    `username: '{{ username }}'` or `username: "{{ username }}"`, because it is
    valid YAML.
    """
    raw_template = START_DELIMITER.sub(START_DELIMITER_REPLACEMENT, raw_template)
    raw_template = END_DELIMITER.sub(END_DELIMITER_REPLACEMENT, raw_template)

    return raw_template


def parse_template(raw_template) -> dict:
    """
    Returns parsed template YAML.
    """
    raw_template = make_template_yaml_safe(raw_template)

    return yaml.safe_load(raw_template)


def validate_template(template: dict) -> None:
    """
    Validates template definition.
    """
    try:
        return TemplateSchema.parse_obj(template)
    except ValidationError as error:
        raise InvalidTemplateException(f'Template is invalid.\n{display_errors(error.errors())}')


def load_template(raw_template: str) -> TemplateSchema:
    """
    Parses raw template YAML and validates it.
    """
    try:
        parsed_template_data = parse_template(raw_template)
    except YAMLError as error:
        logger.exception(f'Invalid template. Failed to parse template. {error}')
        raise InvalidTemplateException(f'Failed to parse template. {error}')

    return validate_template(parsed_template_data)


def render_template(template: str, inputs: dict, components_manifests: dict[str, list] | None = None) -> str:
    """
    Renders template with provided context.
    """
    components_context = {}
    if components_manifests is None:
        components_manifests = {}
    for component_name, entities in components_manifests.items():
        grouped_entites = {}
        for entity in entities:
            grouped_entites.setdefault(entity.kind, {})[entity.metadata['name']] = entity.raw_representation
        components_context[component_name] = {'manifest': grouped_entites}
    context = {
        'inputs': inputs,
        'components': components_context
    }
    return pystache.render(template, context)


def validate_inputs(template: str, inputs: dict) -> None:
    """
    Ensures that provided inputs are correspond to specification in template.
    """
    template_schema = load_template(template)

    absent_inputs = template_schema.inputs_mapping.keys() - inputs.keys()
    if absent_inputs:
        raise InvalidUserInputsException(f'Absent template input(s): {", ".join(absent_inputs)}')
    extra_inputs = inputs.keys() - template_schema.inputs_mapping.keys()
    if extra_inputs:
        raise InvalidUserInputsException(f'Unexpected extra template input(s): {", ".join(extra_inputs)}')


def find_placeholders(template: str) -> set[str]:
    """
    Return list of placeholders in template.
    """
    placeholders: list[str] = PLACEHOLDERS.findall(template)
    placeholders = [placeholder.strip() for placeholder in placeholders]

    return set(placeholders)
