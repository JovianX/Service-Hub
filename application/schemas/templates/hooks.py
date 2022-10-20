"""
Template hook schemas.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field

from constants.templates import HookOnFailureBehavior
from constants.templates import HookTypes
from schemas.common_types import K8sSubdomainNameString


class K8sEnvironmentVariable(BaseModel):
    """
    Environment variable of hook with docker provider.
    """
    name: str = Field(description='Environment variable name.')
    value: str = Field(description='Environment variable value.')


class Hook(BaseModel):
    """
    Application hook schema.
    """
    name: str = Field(description='Unique across all event hooks hook name.')
    type: HookTypes = Field(description='Hook type.')
    namespace: K8sSubdomainNameString | None = Field(
        description='Optional namespace. If skipped used application namespace.'
    )
    service_account_name: str | None = Field(
        description='Kubernetes service account name that is using during Kubernetes pod creation.',
        default='default'
    )
    kube_context: str | None = Field(
        description='Kubernetes configuration context to use. If omitted application context will be use.'
    )
    on_failure: HookOnFailureBehavior | None = Field(description='', default=HookOnFailureBehavior.stop)
    timeout: int = Field(description='Time in seconds before hook execution considered as failed.', default=120)
    image: str = Field(description='Docker image for Kubernetes pod.')
    command: list[str] = Field(description='Kubernetes job command.')
    args: list[str] = Field(description='Kubernetes job command arguments.')
    env: list[K8sEnvironmentVariable] | None = Field(description='Kubernetes pod container environment variables.')

    class Config:
        extra = Extra.forbid


class Hooks(BaseModel):
    """
    Application hook root schema.
    """
    pre_install: list[Hook] | None = Field(description='Hooks which is executing before application launch.')
    post_install: list[Hook] | None = Field(description='Hooks which is executing after application launch.')

    pre_upgrade: list[Hook] | None = Field(
        description='Hooks which is executing before application template upgrade launch.'
    )
    post_upgrade: list[Hook] | None = Field(
        description='Hooks which is executing after application template upgrade launch.'
    )

    pre_delete: list[Hook] | None = Field(description='Hooks which is executing before application deletion.')
    post_delete: list[Hook] | None = Field(description='Hooks which is executing after application deletion.')

    class Config:
        extra = Extra.forbid
