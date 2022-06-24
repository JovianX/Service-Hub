from enum import Enum
from typing import List
from typing import Literal
from typing import Optional
from typing import Union

from pydantic import AnyHttpUrl
from pydantic import BaseModel
from pydantic import Field


class KubernetesConfigurationClusterDefenitionSchema(BaseModel):
    certificate_authority_data: str = Field(alias='certificate-authority-data', description='Admin certificate.')
    # TODO: Find way to properly serialize server property. Currently it is serialized as:
    #       `'server': AnyHttpUrl('https://35.224.212.222', scheme='https', host='35.224.212.222', host_type='ipv4')`
    #       and it is breaks Kubernetes configuration file.
    # server: AnyHttpUrl = Field(description='Server URL.')
    server: str = Field(description='Server URL.')

    class Config:
        allow_population_by_field_name = True


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


class KubernetesConfigurationSchema(BaseModel):
    kind: Literal['Config'] = Field(description='Type of entity. For configuration always must be "Config".')
    api_version: str = Field(alias='apiVersion', description='Version of using API in form of semantic versioning')
    current_context: str = Field(alias='current-context', description='Default context.')
    clusters: List[KubernetesConfigurationClusterSchema] = Field(description='List of clusters.')
    contexts: List[KubernetesConfigurationContextSchema] = Field(description='List of contexts.')
    users: List[KubernetesConfigurationUserSchema] = Field(description='List of users.')
    preferences: dict = Field(description='Various settings.')

    class Config:
        allow_population_by_field_name = True

    def dict(self, *args, **kwargs):
        kwargs['by_alias'] = True
        return super().dict(*args, **kwargs)


class SettingsSchema(BaseModel):
    kubernetes_configuration: Optional[KubernetesConfigurationSchema] = Field(
        description='Kubernetes configuration to use during application management.'
    )


ROOT_SETTING_NAMES = Enum(
    'SettingNames',
    {field_name: field_name for field_name in SettingsSchema.__fields__.keys()},
    type=str
)


ROOT_SETTING_SCHEMAS = Union[  # type: ignore
    tuple(field.type_ for field in SettingsSchema.__fields__.values())
]
