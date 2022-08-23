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
    certificate_authority_data: str = Field(
        alias='certificate-authority-data', description='Admin certificate.',
        example='dG9rZW4='
    )
    server: str = Field(description='Server URL.', example='https://42.42.42.42')


class KubernetesConfigurationClusterSchema(BaseModel):
    cluster: KubernetesConfigurationClusterDefenitionSchema = Field(description='Cluster defenition.')
    name: str = Field(description='Name of cluster entity.', example='some-cluster')


class KubernetesConfigurationContextDefenitionSchema(BaseModel):
    cluster: str = Field(description='Cluste name.', example='some-cluster')
    namespace: str | None = Field(description='Namespace name', example='some-namespace')
    user: str = Field(description='User name', example='some-user')


class KubernetesConfigurationContextSchema(BaseModel):
    context: KubernetesConfigurationContextDefenitionSchema = Field(description='Context defenition.')
    name: str = Field(description='Name of context entity.', example='some-context')


class KubernetesConfigurationUserSchema(BaseModel):
    user: dict = Field(
        description='User authentication and authorization details.', example={'token': 'some-user-token'}
    )
    name: str = Field(description='Name of user entity.', example='some-user')


class KubernetesConfigurationSchema(BaseModel):
    kind: Literal['Config'] = Field(description='Type of entity. For configuration always must be "Config".')
    api_version: str = Field(
        alias='apiVersion', description='Version of using API in form of semantic versioning', example='v1'
    )
    current_context: str = Field(alias='current-context', description='Default context.', example='some-context')
    clusters: List[KubernetesConfigurationClusterSchema] = Field(description='List of clusters.')
    contexts: List[KubernetesConfigurationContextSchema] = Field(description='List of contexts.')
    users: List[KubernetesConfigurationUserSchema] = Field(description='List of users.')
    preferences: dict | None = Field(description='Various settings.')
