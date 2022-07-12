"""
Common project constants.
"""
from enum import Enum
from enum import EnumMeta


UNRECOGNIZED_CLOUD_PROVIDER_REGION = 'unrecognized'


class MetaEnum(EnumMeta):
    def __contains__(cls, item):
        try:
            cls(item)
        except ValueError:
            return False
        return True


class StrEnum(str, Enum, metaclass=MetaEnum):
    pass


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
