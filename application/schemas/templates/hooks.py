"""
Template hook schemas.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field
from pydantic import conlist
from pydantic import validator

from constants.templates import HookOnFailureBehavior
from constants.templates import HookTypes
from schemas.common_types import K8sSubdomainNameString

from .validators import unique_names


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
    enabled: bool | None = Field(description='Is hook must be executed.', default=True)
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
    on_failure: HookOnFailureBehavior | None = Field(
        description='Behavior on hook execution failure.', default=HookOnFailureBehavior.stop
    )
    timeout: int = Field(
        description='Time in seconds before hook execution considered as failed.',
        default=300,
        gt=0,
        le=3600
    )
    image: str = Field(description='Docker image for Kubernetes pod.')
    command: conlist(str, min_items=1) = Field(description='Kubernetes job command.')
    args: conlist(str, min_items=1) = Field(description='Kubernetes job command arguments.')
    env: list[K8sEnvironmentVariable] | None = Field(
        description='Kubernetes pod container environment variables.',
        default_factory=list
    )

    class Config:
        extra = Extra.forbid


class Hooks(BaseModel):
    """
    Application hook root schema.
    """
    pre_install: list[Hook] | None = Field(
        description='Hooks which is executing before application launch.',
        default_factory=list
    )
    post_install: list[Hook] | None = Field(
        description='Hooks which is executing after application launch.',
        default_factory=list
    )

    pre_upgrade: list[Hook] | None = Field(
        description='Hooks which is executing before application template upgrade launch.',
        default_factory=list
    )
    post_upgrade: list[Hook] | None = Field(
        description='Hooks which is executing after application template upgrade launch.',
        default_factory=list
    )

    pre_terminate: list[Hook] | None = Field(
        description='Hooks which is executing before application deletion.',
        default_factory=list
    )
    post_terminate: list[Hook] | None = Field(
        description='Hooks which is executing after application deletion.',
        default_factory=list
    )

    class Config:
        extra = Extra.forbid

    _unique_pre_install_hook_names = validator('pre_install', allow_reuse=True)(unique_names)
    _unique_post_install_hook_names = validator('post_install', allow_reuse=True)(unique_names)

    _unique_pre_upgrade_hook_names = validator('pre_upgrade', allow_reuse=True)(unique_names)
    _unique_post_upgrade_hook_names = validator('post_upgrade', allow_reuse=True)(unique_names)

    _unique_pre_terminate_hook_names = validator('pre_terminate', allow_reuse=True)(unique_names)
    _unique_post_terminate_hook_names = validator('post_terminate', allow_reuse=True)(unique_names)
