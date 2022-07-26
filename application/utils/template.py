"""
Templates related helpers.
"""
import re

import yaml


START_DELIMITER = re.compile(r'''(?<!['"])\{\{''')
END_DELIMITER = re.compile(r'''\}\}(?!['"])''')
START_DELIMITER_REPLACEMENT = '"{{{'
END_DELIMITER_REPLACEMENT = '}}}"'


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
