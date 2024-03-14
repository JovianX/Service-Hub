"""
Templates related constants.
"""
from .base_enum import StrEnum
from typing import Union
from pydantic import Field, BaseModel, constr
from .base_enum import StrEnum
from typing import Optional


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


class http(StrEnum):
    """
    Template HTTP component types.
    """
    url = 'url'
    method = 'method'
    headers = 'headers'
    parameters = 'parameters'

class httpMethods(StrEnum):
    """
    Template HTTP component methods.
    """
    get = 'GET'
    post = 'POST'
    put = 'PUT'
    patch = 'PATCH'
    delete = 'DELETE'


class httpDeploy(BaseModel):
    """
    Deploy schema for HTTP type components.
    """
    url: constr(min_length=1, strip_whitespace=True) = Field(description='URL for HTTP deployment', example='http://example.com')
    method: Union[httpMethods, constr(min_length=1, strip_whitespace=True)] = Field(default=httpMethods.get, description='HTTP method for deployment', example=httpMethods.post)
    headers: Optional[dict] = Field(description='Headers for HTTP deployment', example={'Content-Type': 'application/json'})
    parameters: Optional[dict | list[dict]] = Field(description='Parameters for HTTP deployment', example=[{'param1': 'value1'}])

class httpStatus(BaseModel):
    """
    Status schema for HTTP type components.
    """
    url: constr(min_length=1, strip_whitespace=True) = Field(description='URL for HTTP status', example='http://example.com/status')
    method: Union[httpMethods, constr(min_length=1, strip_whitespace=True)] = Field(default=httpMethods.get, description='HTTP method for status', example=httpMethods.post)
    headers: Optional[dict] = Field(description='Headers for HTTP status', example={'Content-Type': 'application/json'})
    parameters: Optional[dict | list[dict]] = Field(description='Parameters for HTTP status', example=[{'param1': 'value1'}])

class httpDelete(BaseModel):
    """
    Delete schema for HTTP type components.
    """
    url: constr(min_length=1, strip_whitespace=True) = Field(description='URL for HTTP deletion', example='http://example.com/delete')
    method: Union[httpMethods, constr(min_length=1, strip_whitespace=True)] = Field(default=httpMethods.delete, description='HTTP method for deletion', example=httpMethods.post)
    headers: Optional[dict] = Field(description='Headers for HTTP deletion', example={'Content-Type': 'application/json'})
    parameters: Optional[dict | list[dict]] = Field(description='Parameters for HTTP deletion', example=[{'param1': 'value1'}])
