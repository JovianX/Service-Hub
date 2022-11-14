"""
Kubernetes manager related functionality.
"""
from constants.common import HTTPMethods
from constants.kubernetes import K8sKinds
from exceptions.kubernetes import K8sAlreadyExistsException
from exceptions.kubernetes import KubectlException
from exceptions.kubernetes import ProxyRequestException
from services.kubernetes.cli.facade import KubectlCLI
from services.kubernetes.client import K8sClient
from services.kubernetes.schemas import K8sEntitySchema


class K8sManager:
    """
    Manager responsible to handle Kubernetes business logic.
    """
    client: K8sClient
    cli: KubectlCLI

    def __init__(self, configuration_path: str) -> None:
        self.client = K8sClient(configuration_path)
        self.cli = KubectlCLI(configuration_path)

    async def create_namespace(
        self, context_name: str, name: str, *, exists_ok: bool | None = False
    ) -> K8sEntitySchema:
        """
        Creates namespace in cluster.
        """
        try:
            return await self.client.create_namespace(context_name, name)
        except K8sAlreadyExistsException:
            if exists_ok:
                return
            else:
                raise

    async def get_list(self, context_name: str, kind: K8sKinds) -> list[K8sEntitySchema]:
        """
        Returns list of Kubernetes entities.
        """
        if kind == K8sKinds.ingress:
            return await self.client.list_ingress(context_name=context_name)
        elif kind == K8sKinds.namespace:
            return await self.client.list_namespaces(context_name=context_name)
        elif kind == K8sKinds.service:
            return await self.client.list_services(context_name=context_name)
        else:
            raise ValueError(
                f'Failed to fetch list of Kubernetes entities. Unhandled Kubernetes entity kind: "{kind}".'
            )

    async def get_details(self, context_name: str, namespace: str, kind: K8sKinds, name: str) -> K8sEntitySchema:
        """
        Returns entity details.
        """
        if kind == K8sKinds.cluster_role:
            return await self.client.get_cluster_role_details(context_name=context_name, name=name)
        elif kind == K8sKinds.cluster_role_binding:
            return await self.client.get_cluster_role_binding_details(context_name=context_name, name=name)
        elif kind == K8sKinds.config_map:
            return await self.client.get_config_map_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.cron_job:
            return await self.client.get_cron_job_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.daemon_set:
            return await self.client.get_daemon_set_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.deployment:
            return await self.client.get_deployment_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.ingress:
            return await self.client.get_ingress_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.job:
            return await self.client.get_job_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.persistent_volume_claim:
            return await self.client.get_persistent_volume_claim_details(
                context_name=context_name, namespace=namespace, name=name
            )
        elif kind == K8sKinds.pod:
            return await self.client.get_pod_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.pod_security_policy:
            return await self.client.get_pod_security_policy_details(context_name=context_name, name=name)
        elif kind == K8sKinds.replica_set:
            return await self.client.get_replica_set_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.replication_controller:
            return await self.client.get_replication_controller_details(
                context_name=context_name, namespace=namespace, name=name
            )
        elif kind == K8sKinds.role:
            return await self.client.get_role_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.role_binding:
            return await self.client.get_role_binding_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.secret:
            return await self.client.get_secret_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.service:
            return await self.client.get_service_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.service_account:
            return await self.client.get_service_account_details(
                context_name=context_name, namespace=namespace, name=name
            )
        elif kind == K8sKinds.stateful_set:
            return await self.client.get_stateful_set_details(context_name=context_name, namespace=namespace, name=name)
        else:
            raise ValueError(f'Failed to fetch Kubernetes entity details. Unhandled Kubernetes entity kind: "{kind}".')

    async def get_namespace_details(self, context_name: str, name: str) -> K8sEntitySchema:
        """
        Returns namespace details.
        """
        return await self.client.get_namespace_details(context_name=context_name, name=name)

    async def get_log(self, context_name: str, namespace: str, kind: K8sKinds, entity_name: str) -> str:
        """
        Returns entity logs.
        """
        return await self.cli.logs.get(
            context_name=context_name, namespace=namespace, kind=kind, entity_name=entity_name
        )

    async def is_configuration_valid(self, context_name: str):
        """
        Validates Kubernetes configuration by attempting to connection to
        cluster with given context name. If validation fails returns `False`
        else `True`.
        """
        try:
            await self.cli.cluster_information.get(context_name)
        except KubectlException:
            return False

        return True

    async def make_service_proxy_request(
        self, context_name: str, namespace: str, service_name: str, method: HTTPMethods, path: str,
        headers: dict | None = None, timeout: int | None = None
    ) -> tuple[int, str]:
        """
        Makes request to application endpoint deployed in cloud.
        """
        if method == HTTPMethods.get:
            try:
                response = await self.client.make_get_service_proxy_request(
                    context_name=context_name, namespace=namespace, service_name=service_name, path=path,
                    headers=headers, timeout=timeout
                )
                return 200, str(response).strip()
            except ProxyRequestException as error:
                return error.status_code, error.reason
        elif method == HTTPMethods.post:
            try:
                response = await self.client.make_post_service_proxy_request(
                    context_name=context_name, namespace=namespace, service_name=service_name, path=path,
                    headers=headers, timeout=timeout
                )
                return 200, str(response).strip()
            except ProxyRequestException as error:
                return error.status_code, error.reason
        else:
            raise ValueError(f'Unhandled request method "{method}" during service proxy call.')

    async def run_command(
        self, context_name: str, namespace: str, job_name: str, image: str, command: list[str], args: list[str],
        env: list[dict], service_account_name: str | None = None
    ):
        """
        Executes command in container by creating Kubernetes job.
        """
        service_account_name = service_account_name or 'default'
        await self.client.create_job(
            context_name=context_name,
            namespace=namespace,
            job_name=job_name,
            image=image,
            command=command,
            args=args,
            env=env,
            container_name=f'{job_name}-container',
            service_account_name=service_account_name
        )

    async def delete_context(self, context_name: str):
        """
        Deletes context from Kubernetes configuration.
        """
        await self.cli.configuration.delete_context(context_name)
