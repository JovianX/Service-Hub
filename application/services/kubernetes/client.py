"""
Client to interact with Kubernetes cluster.
"""
from fastapi import status
from kubernetes_asyncio.client import AppsV1Api
from kubernetes_asyncio.client import CoreV1Api
from kubernetes_asyncio.client import PolicyV1beta1Api
from kubernetes_asyncio.client import RbacAuthorizationV1Api
from kubernetes_asyncio.client.exceptions import ApiException
from kubernetes_asyncio.config import new_client_from_config

from .schemas import K8sEntitySchema


class K8sClient:
    """
    Class contains business logic of interaction with Kubernetes.
    """
    configuration_file_path: str

    def __init__(self, configuration_path):
        self.configuration_file_path = configuration_path

    def is_not_foud(self, error: ApiException) -> bool:
        if error.status == status.HTTP_404_NOT_FOUND and error.reason == 'Not Found':
            return True

        return False

    async def get_cluster_role_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns cluster role details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = RbacAuthorizationV1Api(client)
            entity = await api.read_cluster_role(name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_cluster_role_binding_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns cluster role binding details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = RbacAuthorizationV1Api(client)
            entity = await api.read_cluster_role_binding(name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_config_map_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns config map details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_config_map(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_daemon_set_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns daemon set details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_daemon_set(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_deployment_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns deployment details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_deployment(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_persistent_volume_claim_details(
        self, context_name: str, namespace: str, name: str
    ) -> K8sEntitySchema:
        """
        Returns persistent volume claim details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_persistent_volume_claim(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_pod_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns pod details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            try:
                entity = await api.read_namespaced_pod(namespace=namespace, name=name)
            except ApiException as error:
                if self.is_not_foud(error):
                    return
                raise

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_pod_security_policy_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns pod security policy details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = PolicyV1beta1Api(client)
            entity = await api.read_pod_security_policy(name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_replica_set_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns replica set details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_replica_set(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_replication_controller_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns replication controller details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_replication_controller(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_role_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns role details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = RbacAuthorizationV1Api(client)
            entity = await api.read_namespaced_role(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_role_binding_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns role binding details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = RbacAuthorizationV1Api(client)
            entity = await api.read_namespaced_role_binding(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_secret_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns secret details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_secret(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_service_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns service details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_service(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_service_account_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns service account details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            entity = await api.read_namespaced_service_account(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())

    async def get_stateful_set_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns stateful set details.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = AppsV1Api(client)
            entity = await api.read_namespaced_stateful_set(namespace=namespace, name=name)

            return K8sEntitySchema.parse_obj(entity.to_dict())
