from typing import List
from typing import Literal

from pydantic import AnyHttpUrl
from pydantic import BaseModel as PydanticBaseModel
from pydantic import Extra
from pydantic import Field


class BaseModel(PydanticBaseModel):
    class Config:
        allow_population_by_field_name = True
        extra = Extra.forbid


class KubernetesConfigurationClusterDefenitionSchema(BaseModel):
    certificate_authority_data: str = Field(alias='certificate-authority-data', description='Admin certificate.')
    # TODO: Find way to properly serialize server property. Currently it is serialized as:
    #       `'server': AnyHttpUrl('https://35.224.212.222', scheme='https', host='35.224.212.222', host_type='ipv4')`
    #       and it is breaks Kubernetes configuration file.
    # server: AnyHttpUrl = Field(description='Server URL.')
    server: str = Field(description='Server URL.')


class KubernetesConfigurationClusterSchema(BaseModel):
    cluster: KubernetesConfigurationClusterDefenitionSchema = Field(description='Cluster defenition.')
    name: str = Field(description='Name of cluster entity.')


class KubernetesConfigurationContextDefenitionSchema(BaseModel):
    cluster: str = Field(description='Cluste name.')
    namespace: str | None = Field(description='Namespace name')
    user: str = Field(description='User name')


class KubernetesConfigurationContextSchema(BaseModel):
    context: KubernetesConfigurationContextDefenitionSchema = Field(description='Context defenition.')
    name: str = Field(description='Name of context entity.')


class KubernetesConfigurationUserSchema(BaseModel):
    user: dict = Field(description='User authentication and authorization details.')
    name: str = Field(description='Name of user entity.')


class KubernetesConfigurationSchema(BaseModel):
    kind: Literal['Config'] = Field(description='Type of entity. For configuration always must be "Config".')
    api_version: str = Field(alias='apiVersion', description='Version of using API in form of semantic versioning')
    current_context: str = Field(alias='current-context', description='Default context.')
    clusters: List[KubernetesConfigurationClusterSchema] = Field(description='List of clusters.')
    contexts: List[KubernetesConfigurationContextSchema] = Field(description='List of contexts.')
    users: List[KubernetesConfigurationUserSchema] = Field(description='List of users.')
    preferences: dict | None = Field(description='Various settings.')
