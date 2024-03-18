"""
Templates related constants.
"""
from typing import Optional
from typing import Union

from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl
from pydantic import constr
from pydantic import validator

from .base_enum import StrEnum


class InputTypes(StrEnum):
    """
    Template user input form widget types.
    """
    checkbox = 'checkbox'
    number = 'number'
    password = 'password'
    radio_select = 'radio_select'
    select = 'select'
    slider = 'slider'
    switch = 'switch'
    text = 'text'
    textarea = 'textarea'


class ComponentTypes(StrEnum):
    """
    Template application components types.
    """
    helm_chart = 'helm_chart'
    http = 'http'


class HookOnFailureBehavior(StrEnum):
    """
    Template application behavior on hook failure types.

    stop - if hook fails application action fails too.
    continue - if hook fails skip this failed hook and continue application
               action execution.
    """
    stop = 'stop'
    skip = 'continue'


class HookTypes(StrEnum):
    """
    Template application hook types.
    """
    kubernetes_job = 'kubernetes_job'


class ComponentTypeHttpMethods(StrEnum):
    """
    Template HTTP component methods.
    """
    get = 'get'
    post = 'post'
    put = 'put'
    patch = 'patch'
    delete = 'delete'


class HttpDeploy(BaseModel):
    """
    Deploy schema for HTTP type components.
    """
    url: HttpUrl = Field(description='URL for HTTP deployment.', example='http://example.com/path/to/deploy')
    method: ComponentTypeHttpMethods = Field(
        default=ComponentTypeHttpMethods.get,
        description='HTTP method for deployment',
        example=ComponentTypeHttpMethods.post)
    headers: dict | list[dict] | None = Field(
        description='Headers for HTTP deployment', example={
            'Content-Type': 'application/json'})
    parameters: dict | list[dict] | None = Field(
        description='Parameters for HTTP deployment', example=[{'param1': 'value1'}])


class HttpStatus(BaseModel):
    """
    Status schema for HTTP type components.
    """
    url: HttpUrl = Field(description='URL for HTTP status.', example='http://example.com/path/to/status')
    method: ComponentTypeHttpMethods = Field(
        default=ComponentTypeHttpMethods.get,
        description='HTTP method for status',
        example=ComponentTypeHttpMethods.post)
    headers: dict | list[dict] | None = Field(
        description='Headers for HTTP status', example={
            'Content-Type': 'application/json'})
    parameters: dict | list[dict] | None = Field(
        description='Parameters for HTTP status', example=[{'param1': 'value1'}])


class HttpDelete(BaseModel):
    """
    Delete schema for HTTP type components.
    """
    url: HttpUrl = Field(description='URL for HTTP delete.', example='http://example.com/path/to/delete')
    method: ComponentTypeHttpMethods = Field(
        default=ComponentTypeHttpMethods.get,
        description='HTTP method for delete',
        example=ComponentTypeHttpMethods.delete)
    headers: dict | list[dict] | None = Field(
        description='Headers for HTTP delete', example={
            'Content-Type': 'application/json'})
    parameters: dict | list[dict] | None = Field(
        description='Parameters for HTTP delete', example=[{'param1': 'value1'}])
