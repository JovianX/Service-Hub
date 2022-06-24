"""
Client to interact with Kubernetes cluster.
"""
from kubernetes.client import Configuration
from kubernetes.config import load_kube_config
from kubernetes_asyncio.client import AppsV1Api
from kubernetes_asyncio.client import CoreV1Api
from kubernetes_asyncio.client.api_client import ApiClient

from .schemas import K8sEntitySchema


class K8sClient:
    """
    Class contains business logic of interaction with Kubernetes.
    """
    configuration: Configuration

    def __init__(self, configuration_path):
        self.configuration = Configuration()
        load_kube_config(config_file=configuration_path, client_configuration=self.configuration)

    async def get_daemon_set_details(self, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns daemon set details.
        """
        async with ApiClient(self.configuration) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_daemon_set(name=name, namespace=namespace)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_deployment_details(self, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns deployment details.
        """
        async with ApiClient(self.configuration) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_deployment(name=name, namespace=namespace)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_replica_set_details(self, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns replica set details.
        """
        async with ApiClient(self.configuration) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_replica_set(name=name, namespace=namespace)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_replication_controller_details(self, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns replication controller details.
        """
        async with ApiClient(self.configuration) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_replication_controller(name=name, namespace=namespace)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_service_details(self, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns service details.
        """
        async with ApiClient(self.configuration) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_service(name=name, namespace=namespace)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_stateful_set_details(self, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns stateful set details.
        """
        async with ApiClient(self.configuration) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_stateful_set(name=name, namespace=namespace)

            return K8sEntitySchema.parse_obj(entity.to_dict())
