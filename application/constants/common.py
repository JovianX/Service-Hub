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
