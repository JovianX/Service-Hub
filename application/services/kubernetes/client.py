"""
Client to interact with Kubernetes cluster.
"""
import logging
from typing import Any

from kubernetes_asyncio.client import ApiClient
from kubernetes_asyncio.client import AppsV1Api
from kubernetes_asyncio.client import BatchV1Api
from kubernetes_asyncio.client import CoreV1Api
from kubernetes_asyncio.client import NetworkingV1Api
from kubernetes_asyncio.client import PolicyV1beta1Api
from kubernetes_asyncio.client import RbacAuthorizationV1Api
from kubernetes_asyncio.client import V1Container
from kubernetes_asyncio.client import V1EnvVar
from kubernetes_asyncio.client import V1Job
from kubernetes_asyncio.client import V1JobSpec
from kubernetes_asyncio.client import V1JobStatus
from kubernetes_asyncio.client import V1Namespace
from kubernetes_asyncio.client import V1ObjectMeta
from kubernetes_asyncio.client import V1PodSpec
from kubernetes_asyncio.client import V1PodTemplate
from kubernetes_asyncio.client import V1PodTemplateSpec
from kubernetes_asyncio.client.exceptions import ApiException
from kubernetes_asyncio.config import new_client_from_config

from constants.kubernetes import K8sKinds
from exceptions.kubernetes import K8sAlreadyExistsException
from exceptions.kubernetes import K8sEntityDoesNotExistException
from exceptions.kubernetes import KubernetesClientException
from exceptions.kubernetes import KubernetesException
from exceptions.kubernetes import ProxyRequestException
from schemas.templates.hooks import K8sEnvironmentVariable

from .schemas import K8sEntitySchema


logger = logging.getLogger(__name__)


class K8sClient:
    """
    Class contains business logic of interaction with Kubernetes.
    """
    configuration_file_path: str

    def __init__(self, configuration_path):
        self.configuration_file_path = configuration_path

    async def create_job(
        self, context_name: str, namespace: str, job_name: str, image: str, command: list[str], args: list[str],
        env: list[K8sEnvironmentVariable], container_name: str, ttl_after_finished: int = 120,
        service_account_name='default'
    ):
        """
        Create job to execute some command.

        context_name - name of context from Kubernetes configuratoin.
        namespace - namespace where to create job.
        job_name - name of the job. Must be unique in namespace.
        image - name of container image. For instance `alpine`.
        command - command to execute. For instance `['/bin/sh', '-c']`.
        args - command arguments. For instance `['sleep 1']`.
        env - list of environment variables to set in container in form of
              dictionary with `name` and `value` keys.
              For instance:
              ```
              [
                {'name': 'SOME_VARIABLE_NAME_1', 'value': 'SOME_VARIABLE_VALUE_1'},
                {'name': 'SOME_VARIABLE_NAME_2', 'value': 'SOME_VARIABLE_VALUE_2'},
              ]
              ```.
        container_name - name of container where job is running.
        ttl_after_finished - Time to live of job in seconds after execution finish. Default is 120 seconds.
        service_account_name - name of Kubernetes service account to use during job creation.
        """
        # Job body creation.
        body = V1Job(api_version='batch/v1', kind='Job')
        body.metadata = V1ObjectMeta(namespace=namespace, name=job_name)
        body.status = V1JobStatus()
        template = V1PodTemplate()
        template.template = V1PodTemplateSpec()
        template.template.spec = V1PodSpec(
            containers=[
                V1Container(
                    name=container_name,
                    image=image,
                    command=command,
                    args=args,
                    env=[V1EnvVar(name=variable.name, value=variable.value) for variable in env]
                )
            ],
            restart_policy='Never',
            service_account_name=service_account_name
        )
        body.spec = V1JobSpec(
            ttl_seconds_after_finished=ttl_after_finished,
            template=template.template
        )
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = BatchV1Api(client)
            try:
                k8s_entity = await api.create_namespaced_job(namespace, body)

                entity = K8sEntitySchema.parse_obj(k8s_entity.to_dict())
                entity._raw_representation = client.sanitize_for_serialization(k8s_entity)

                return entity
            except ApiException as error:
                logger.exception(
                    f'Failed to create <Job name="{job_name}", namespace="{namespace}" context_name="{context_name}">. '
                    f'{error.message}'
                )
                raise KubernetesException(error.message)

    async def create_namespace(self, context_name: str, name: str) -> None:
        """
        Creates namespace in cluster.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            body = V1Namespace(metadata=V1ObjectMeta(name=name))
            try:
                k8s_entity = await api.create_namespace(body)

                entity = K8sEntitySchema.parse_obj(k8s_entity.to_dict())
                entity._raw_representation = client.sanitize_for_serialization(k8s_entity)

                return entity
            except ApiException as error:
                K8sAlreadyExistsException.check_and_raise(error)
                raise KubernetesClientException(
                    f'Failed to create namespace "{name}".',
                    details=error.details, api_response_code=error.code, reason=error.reason
                )

    async def list_namespaces(self, context_name: str) -> list[K8sEntitySchema]:
        """
        Returns list of all namespaces in cluster.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            response = await api.list_namespace()

            return self._list_data_post_processing(response, K8sKinds.namespace, client)

    async def list_ingress(self, context_name: str):
        """
        Lists services in cluster.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = NetworkingV1Api(client)
            response = await api.list_ingress_for_all_namespaces()

            return self._list_data_post_processing(response, K8sKinds.ingress, client)

    async def list_services(self, context_name: str):
        """
        Lists services in cluster.
        """
        async with await new_client_from_config(self.configuration_file_path, context_name) as client:
            api = CoreV1Api(client)
            response = await api.list_service_for_all_namespaces()

            return self._list_data_post_processing(response, K8sKinds.service, client)

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

    async def get_namespace_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns namespace details.
        """
        return await self._get_details(CoreV1Api, 'read_namespace', context_name, name=name)

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
        return await self._get_details(
            CoreV1Api, 'read_namespaced_pod', context_name, namespace=namespace, name=name
        )

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
            try:
                k8s_entity = await method(**kwargs)
            except ApiException as error:
                K8sEntityDoesNotExistException.check_and_raise(error)

        entity = K8sEntitySchema.parse_obj(k8s_entity.to_dict())
        entity._raw_representation = client.sanitize_for_serialization(k8s_entity)

        return entity

    def _list_data_post_processing(self, item_list: Any, kind: K8sKinds, client: ApiClient) -> list[K8sEntitySchema]:
        """
        Kubernetes list item post processing.

        For some reason when requesting any item list through Python
        client in response absent at least `apiVersion` and `kind`
        attributes of entity. This breaks schema validation.
        """
        entities_list = []
        for item in item_list.items:
            item.api_version = item_list.api_version
            item.kind = kind.value
            entity = K8sEntitySchema.parse_obj(item.to_dict())
            entity._raw_representation = client.sanitize_for_serialization(item)
            entities_list.append(entity)

        return entities_list
