"""
Client to interact with Kubernetes cluster.
"""
from typing import Any

from fastapi import status
from kubernetes_asyncio.client import AppsV1Api
from kubernetes_asyncio.client import BatchV1Api
from kubernetes_asyncio.client import CoreV1Api
from kubernetes_asyncio.client import NetworkingV1Api
from kubernetes_asyncio.client import PolicyV1beta1Api
from kubernetes_asyncio.client import RbacAuthorizationV1Api
from kubernetes_asyncio.client.exceptions import ApiException
from kubernetes_asyncio.config import new_client_from_config

from application.constants.kubernetes import K8sKinds
from application.exceptions.kubernetes import ProxyRequestException

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

    async def list_namespaces(self, context_name: str) -> list[K8sEntitySchema]:
        """
        Returns list of all namespaces in cluster.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            response = await api.list_namespace()

        return self._list_data_post_processing(response, K8sKinds.namespace)

    async def list_ingress(self, context_name: str):
        """
        Lists services in cluster.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = NetworkingV1Api(client)
            response = await api.list_ingress_for_all_namespaces()

        return self._list_data_post_processing(response, K8sKinds.ingress)

    async def list_services(self, context_name: str):
        """
        Lists services in cluster.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            response = await api.list_service_for_all_namespaces()

        return self._list_data_post_processing(response, K8sKinds.service)

    async def get_cluster_role_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns cluster role details.
        """
        return await self._get_details(RbacAuthorizationV1Api, 'read_cluster_role', context_name, name=name)

    async def get_cluster_role_binding_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns cluster role binding details.
        """
        return await self._get_details(RbacAuthorizationV1Api, 'read_cluster_role_binding', context_name, name=name)

    async def get_config_map_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns config map details.
        """
        return await self._get_details(
            CoreV1Api, 'read_namespaced_config_map', context_name, namespace=namespace, name=name
        )

    async def get_cron_job_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns cron job details.
        """
        return await self._get_details(
            BatchV1Api, 'read_namespaced_cron_job', context_name, namespace=namespace, name=name
        )

    async def get_daemon_set_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns daemon set details.
        """
        return await self._get_details(
            AppsV1Api, 'read_namespaced_daemon_set', context_name, namespace=namespace, name=name
        )

    async def get_deployment_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns deployment details.
        """
        return await self._get_details(
            AppsV1Api, 'read_namespaced_deployment', context_name, namespace=namespace, name=name
        )

    async def get_ingress_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns ingress details.
        """
        return await self._get_details(
            NetworkingV1Api, 'read_namespaced_ingress', context_name, namespace=namespace, name=name
        )

    async def get_job_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns job details.
        """
        return await self._get_details(BatchV1Api, 'read_namespaced_job', context_name, namespace=namespace, name=name)

    async def get_persistent_volume_claim_details(
        self, context_name: str, namespace: str, name: str
    ) -> K8sEntitySchema:
        """
        Returns persistent volume claim details.
        """
        return await self._get_details(
            CoreV1Api, 'read_namespaced_persistent_volume_claim', context_name, namespace=namespace, name=name
        )

    async def get_pod_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema | None:
        """
        Returns pod details.
        """
        try:
            return await self._get_details(
                CoreV1Api, 'read_namespaced_pod', context_name, namespace=namespace, name=name
            )
        except ApiException as error:
            if self.is_not_foud(error):
                return
            raise

    async def get_pod_security_policy_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns pod security policy details.
        """
        return await self._get_details(PolicyV1beta1Api, 'read_pod_security_policy', context_name, name=name)

    async def get_replica_set_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns replica set details.
        """
        return await self._get_details(
            AppsV1Api, 'read_namespaced_replica_set', context_name, namespace=namespace, name=name
        )

    async def get_replication_controller_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns replication controller details.
        """
        return await self._get_details(
            CoreV1Api, 'read_namespaced_replication_controller', context_name, namespace=namespace, name=name
        )

    async def get_role_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns role details.
        """
        return await self._get_details(
            RbacAuthorizationV1Api, 'read_namespaced_role', context_name, namespace=namespace, name=name
        )

    async def get_role_binding_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns role binding details.
        """
        return await self._get_details(
            RbacAuthorizationV1Api, 'read_namespaced_role_binding', context_name, namespace=namespace, name=name
        )

    async def get_secret_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns secret details.
        """
        return await self._get_details(
            CoreV1Api, 'read_namespaced_secret', context_name, namespace=namespace, name=name
        )

    async def get_service_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns service details.
        """
        return await self._get_details(
            CoreV1Api, 'read_namespaced_service', context_name, namespace=namespace, name=name
        )

    async def get_service_account_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns service account details.
        """
        return await self._get_details(
            CoreV1Api, 'read_namespaced_service_account', context_name, namespace=namespace, name=name
        )

    async def get_stateful_set_details(self, context_name: str, namespace: str, name: str) -> K8sEntitySchema:
        """
        Returns stateful set details.
        """
        return await self._get_details(
            AppsV1Api, 'read_namespaced_stateful_set', context_name, namespace=namespace, name=name
        )

    async def make_get_service_proxy_request(
        self,
        context_name: str,
        namespace: str,
        service_name: str,
        path: str,
        headers: dict | None = None,
        timeout: int | None = None,
    ):
        """
        Makes GET request to endpoint of application deployed in cloud.
        """
        if headers is None:
            headers = {}
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            try:
                return await api.connect_get_namespaced_service_proxy_with_path(
                    namespace=namespace, name=service_name, path=path, _request_timeout=timeout, _headers=headers
                )
            except ApiException as error:
                raise ProxyRequestException(error.reason, error.status)

    async def make_post_service_proxy_request(
        self,
        context_name: str,
        namespace: str,
        service_name: str,
        path: str,
        headers: dict | None = None,
        timeout: int | None = None,
    ):
        """
        Makes POST request to endpoint of application deployed in cloud.
        """
        if headers is None:
            headers = {}
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            try:
                return await api.connect_post_namespaced_service_proxy_with_path(
                    namespace=namespace, name=service_name, path=path, _request_timeout=timeout, _headers=headers
                )
            except ApiException as error:
                raise ProxyRequestException(error.reason, error.status)

    async def _get_details(
        self,
        api_class: AppsV1Api | BatchV1Api | CoreV1Api | PolicyV1beta1Api | RbacAuthorizationV1Api,
        method_name: str,
        context_name: str,
        **kwargs
    ) -> K8sEntitySchema:
        """
        Helper to get entity details.

        Method parameters must be provided as key-value arguments.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            method = getattr(api_class(client), method_name)
            entity = await method(**kwargs)

        return K8sEntitySchema.parse_obj(entity.to_dict())

    def _list_data_post_processing(self, item_list: Any, kind: K8sKinds) -> list[K8sEntitySchema]:
        """
        Kubernetes list item post processing.

        For some reason when requesting any item list through Python
        client in response absent at least `apiVersion` and `kind`
        attributes of entity. This breaks schema validation.
        """
        entities_list = []
        for item in item_list.items:
            entity = item.to_dict()
            entity['apiVersion'] = 'v1'
            entity['kind'] = kind
            entities_list.append(K8sEntitySchema.parse_obj(entity))

        return entities_list
