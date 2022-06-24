"""
Kubernetes manager related functionality.
"""
from application.constants.kubernetes import K8sKinds
from application.services.kubernetes.cli.facade import KubectlCLI
from application.services.kubernetes.client import K8sClient
from application.services.kubernetes.schemas import K8sEntitySchema


class K8sManager:
    """
    Manager responsible to handle Kubernetes business logic.
    """
    client: K8sClient
    cli: KubectlCLI

    def __init__(self, configuration_path: str) -> None:
        self.client = K8sClient(configuration_path)
        self.cli = KubectlCLI(configuration_path)

    async def get_details(self, context_name: str, namespace: str, kind: K8sKinds, name: str) -> K8sEntitySchema:
        """
        Returns entity details.
        """
        if kind == K8sKinds.daemon_set:
            return await self.client.get_daemon_set_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.deployment:
            return await self.client.get_deployment_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.replica_set:
            return await self.client.get_replica_set_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.replication_controller:
            return await self.client.get_replication_controller_details(
                context_name=context_name, namespace=namespace, name=name
            )
        elif kind == K8sKinds.service:
            return await self.client.get_service_details(context_name=context_name, namespace=namespace, name=name)
        elif kind == K8sKinds.stateful_set:
            return await self.client.get_stateful_set_details(context_name=context_name, namespace=namespace, name=name)
        else:
            raise ValueError(f'Unhandled Kubernetes entity kind: "{kind}".')

    async def delete_context(self, context_name: str):
        """
        Deletes context from Kubernetes configuration.
        """
        await self.cli.configuration.delete_context(context_name)
