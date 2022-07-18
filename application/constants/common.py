"""
Common project constants.
"""
from .base_enum import StrEnum


UNRECOGNIZED_CLOUD_PROVIDER_REGION = 'unrecognized'


class HTTPMethods(StrEnum):
    """
    HTTP methods.
    """
    connect = 'connect'
    delete = 'delete'
    get = 'get'
    head = 'head'
    options = 'options'
    patch = 'patch'
    post = 'post'
    put = 'put'
    trace = 'trace'


class CloudProviders(StrEnum):
    """
    Supported cloud providers.
    """
    aws = 'aws'
    azure = 'azure'
    gcp = 'gcp'
    unrecognized = 'unrecognized'
