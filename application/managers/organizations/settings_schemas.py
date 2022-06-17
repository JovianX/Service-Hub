from typing import List, Optional
from typing import Literal
from typing import Union

from pydantic import AnyHttpUrl
from pydantic import BaseModel
from pydantic import Field


class KubernetesConfigurationClusterDefenitionSchema(BaseModel):
    certificate_authority_data: str = Field(alias='certificate-authority-data', description='Admin certificate.')
    server: AnyHttpUrl = Field(description='Server URL.')


class KubernetesConfigurationClusterSchema(BaseModel):
    cluster: KubernetesConfigurationClusterDefenitionSchema = Field(description='Cluster defenition.')
    name: str = Field(description='Name of cluster entity.')


class KubernetesConfigurationContextDefenitionSchema(BaseModel):
    cluster: str = Field(description='Cluste name.')
    namespace: str = Field(description='Namespace name')
    user: str = Field(description='User name')


class KubernetesConfigurationContextSchema(BaseModel):
    context: KubernetesConfigurationContextDefenitionSchema = Field(description='Context defenition.')
    name: str = Field(description='Name of context entity.')


class KubernetesConfigurationUserDefenitionSchema(BaseModel):
    token: str = Field(description='User access token.')


class KubernetesConfigurationUserSchema(BaseModel):
    user: KubernetesConfigurationUserDefenitionSchema = Field(description='User defenition.')
    name: str = Field(description='Name of user entity.')


# TODO: During serialization Pydantic renders JSON with field_name instead of
# field-name. This brackes validation on next check.
# class KubernetesConfigurationSchema(BaseModel):
#     kind: Literal['Config'] = Field(description='Type of entity. For configuration always must be "Config".')
#     apiVersion: str = Field(description='Version of using API in form of semantic versioning')
#     current_context: str = Field(alias='current-context', description='Default context.')
#     clusters: List[KubernetesConfigurationClusterSchema] = Field(description='List of clusters.')
#     contexts: List[KubernetesConfigurationContextSchema] = Field(description='List of contexts.')
#     users: List[KubernetesConfigurationUserSchema] = Field(description='List of users.')


class KubernetesConfigurationSchema(BaseModel):
    __root__: dict

    def __iter__(self):
        return iter(self.__root__)

    def __getitem__(self, item):
        return self.__root__[item]

    def dict(self, *args, **kwargs):
        return self.__root__


class SettingsSchema(BaseModel):
    kubernetes_configuration: Optional[KubernetesConfigurationSchema] = Field(
        description='Kubernetes configuration to use during application management.'
    )


ROOT_SETTING_NAMES = Union[  # type: ignore
    tuple(Literal[field_name] for field_name in SettingsSchema.__fields__.keys())  # type: ignore
]

ROOT_SETTING_SCHEMAS = Union[  # type: ignore
    tuple(field.type_ for field in SettingsSchema.__fields__.values())
]
