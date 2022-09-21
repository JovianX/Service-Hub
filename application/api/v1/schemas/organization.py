"""
Organization related API schemas.
"""

from pydantic import BaseModel
from pydantic import Field

from utils.kubernetes import KubernetesConfiguration


class DefaultContextRequestBody(BaseModel):
    context: str = Field(description='New default context name')


class K8sClusterResponseSchema(BaseModel):
    name: str
    region: str | None
    cloud_provider: str | None


class K8sContextResponseSchema(BaseModel):
    name: str
    cluster: str
    user: str


class K8sUserResponseSchema(BaseModel):
    name: str


class K8sConfigurationResponseSchema(BaseModel):
    """
    Payload of Kubernetes configuration response.
    """
    clusters: list[K8sClusterResponseSchema]
    contexts: list[K8sContextResponseSchema]
    users: list[K8sUserResponseSchema]
    current_context: str

    def __init__(self, configuration: KubernetesConfiguration):
        clusters = []
        for cluster_name in configuration.clusters:
            region = None
            cloud_provider = None
            for context_name, context in configuration.contexts.items():
                if context['cluster'] == cluster_name:
                    region = configuration.get_region(context_name)
                    cloud_provider = configuration.get_cloud_provider(context_name)
            clusters.append({
                'name': cluster_name,
                'region': region,
                'cloud_provider': cloud_provider
            })
        contexts = [
            {'name': context_name, 'cluster': context['cluster'], 'user': context['user']}
            for context_name, context in configuration.contexts.items()
        ]
        users = [{'name': user_name} for user_name in configuration.users.keys()]
        current_context = configuration.configuration.get('current_context', '')

        super().__init__(clusters=clusters, contexts=contexts, users=users, current_context=current_context)
