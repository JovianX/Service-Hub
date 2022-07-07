"""
Common project constants.
"""
from enum import Enum


class HTTPMethods(str, Enum):
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


class CloudProviders(str, Enum):
    """
    Supported cloud providers.
    """
    aws = 'aws'
    azure = 'azure'
    gcp = 'gcp'
    unrecognized = 'unrecognized'
