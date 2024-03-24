"""
Template component schemas.
"""
from typing import Annotated
from typing import Literal

from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import PrivateAttr
from pydantic import constr
from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl
from pydantic import constr


from constants.templates import ComponentTypes
from constants.templates import StrEnum

from .validators import TemplateVariable

class ComponentHelm(BaseModel):
    """
    Application component Helm schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(description='Helm release name', example='vault')
    type: Literal[ComponentTypes.helm_chart]
    enabled: bool | TemplateVariable | None = Field(description='Is component must be installed.', default=True)
    chart: constr(
        min_length=1,
        strip_whitespace=True) | None = Field(
        description='Helm chart name.',
        example='bitnami/redis')
    version: constr(min_length=1, strip_whitespace=True) | None = Field(
        description='Helm chart version.',
        example='1.24.1'
    )
    values: list[dict] | None = Field(
        description='Helm values that will be provided during chart install/upgrade. The later element in the list has '
                    'a higher priority.',
    )


class ComponentTypeHttpMethods(StrEnum):
    """
    Template HTTP component methods.
    """
    get = 'get'
    post = 'post'
    put = 'put'
    patch = 'patch'
    delete = 'delete'


class HttpRequest(BaseModel):
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


class ComponentHttp(BaseModel):
    """
    Application component HTTP schema.
    """
    name: constr(min_length=1, strip_whitespace=True) = Field(description='Component Name', example='jenkins')
    type: Literal[ComponentTypes.http]
    enabled: bool | TemplateVariable | None = Field(description='Is component must be installed.', default=True)
    create: HttpRequest = Field(description='Creation details for HTTP type components')
    delete: HttpRequest = Field(description='Deletion details for HTTP type components')
    health: HttpRequest | None = Field(description='Health check for HTTP type components')


Components = Annotated[ComponentHelm |
                       ComponentHttp,
                       Field(discriminator='type')]


class Component(BaseModel):
    """
    Wrapper class for Template Components
    """
    __root__: Components
    _raw_representation = PrivateAttr(default=None)

    def __iter__(self):
        return iter(self.__root__)

    def __getitem__(self, item):
        return self.__root__[item]

    def __getattribute__(self, name: str) -> any:
        try:
            value = super().__getattribute__(name)
        except AttributeError:
            value = getattr(self.__root__, name)

        return value

    def __hash__(self) -> str:
        return hash(self.name)

    def dict(self, *args, **kwargs) -> dict:
        data = super().dict(*args, **kwargs)

        return data['__root__']

    @property
    def raw_representation(self):
        """
        Parsed original JSON representation of Component object.
        """
        if self._raw_representation is None:
            raise ValueError('Original Component object was requested but was not set before.')

        return self._raw_representation

    class Config:
        extra = Extra.forbid
