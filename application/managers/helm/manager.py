"""
Manager for helm business logic.
"""
import asyncio
from asyncio import create_task
from typing import List

from application.constants.helm import ReleaseHealthStatuses
from application.constants.kubernetes import K8sKinds
from application.managers.kubernetes import K8sManager
from application.managers.organizations.manager import OrganizationManager
from application.models.organization import Organization
from application.services.helm.facade import HelmService
from application.utils.helm import HelmArchive

from .schemas import ReleaseDetails
from .schemas import ReleaseListItemSchema


class HelmManager:
    """
    Manager to manipulate helm.
    """
    organization_manager: OrganizationManager

    def __init__(self, organization_manager: OrganizationManager):
        self.organization_manager = organization_manager

    async def add_repository(self, organization: Organization, name: str, url: str) -> None:
        """
        Adds user charts repository.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.repository.add(name, url)

    async def list_repositories(self, organization: Organization) -> List[dict]:
        """
        Lists repositories added user.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)

                return await helm_service.repository.list()

    async def list_repositories_charts(self, organization: Organization):
        """
        Returns lists of charts in all repositories.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.repository.update()
                return await helm_service.search.repositories()

    async def install_chart(
        self,
        organization: Organization,
        context_name: str,
        namespace: str,
        release_name: str,
        chart_name: str,
        values: dict | None = None,
        description: str | None = None
    ) -> str:
        """
        Installs given chart.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                return await helm_service.install.chart(
                    context_name=context_name,
                    namespace=namespace,
                    release_name=release_name,
                    chart_name=chart_name,
                    values=values,
                    description=description
                )

    async def list_releases(self, organization: Organization, namespace: str = None) -> List[ReleaseListItemSchema]:
        """
        List releases in namespace if it is present otherwise in all namespaces
        using default context in kubernetes configuration.
        """
        kubernetes_configuration = self.organization_manager.get_kubernetes_configuration(organization)
        items = []
        with kubernetes_configuration as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                for context_name in kubernetes_configuration.contexts:
                    releases, charts = await asyncio.gather(
                        helm_service.list.releases(context_name, namespace),
                        self.list_repositories_charts(organization)
                    )

                    async def get_entity_details(release_name, namespace):
                        manifests = await helm_service.get.manifest(context_name, namespace, release_name)
                        kind_to_check = (
                            K8sKinds.daemon_set,
                            K8sKinds.deployment,
                            K8sKinds.replica_set,
                            K8sKinds.replication_controller,
                            K8sKinds.service,
                            K8sKinds.stateful_set,
                        )
                        return await asyncio.gather(*[
                            create_task(k8s_manager.get_details(
                                context_name=context_name,
                                namespace=manifest.metadata.namespace,
                                kind=manifest.kind,
                                name=manifest.metadata.name
                            ))
                            for manifest in manifests if manifest.kind in kind_to_check
                        ])

                    releases_entities_details = await asyncio.gather(*[
                        create_task(get_entity_details(release.name, release.namespace))
                        for release in releases
                    ])
                    for release, entities_details in zip(releases, releases_entities_details):
                        item = release.dict()
                        item['available_chart'] = next(
                            ({'chart_name': chart.name, 'chart_verstion': chart.version}
                             for chart in charts if chart.chart_name == release.chart_name),
                            None
                        )
                        item['health_status'] = ReleaseHealthStatuses.healthy
                        item['entities_health_status'] = {}
                        item['context_name'] = context_name
                        for entity in entities_details:
                            entity_is_healthy = entity.is_healthy
                            entity_name = entity.metadata['name']
                            if entity_is_healthy is not None:
                                item['entities_health_status'].setdefault(
                                    entity.kind, {})[entity_name] = entity_is_healthy
                                if not entity_is_healthy:
                                    item['health_status'] = ReleaseHealthStatuses.unhealthy
                        items.append(item)

        return items

    async def release_details(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> ReleaseDetails:
        """
        Get release detailed information.
        """
        kubernetes_configuration = self.organization_manager.get_kubernetes_configuration(organization)
        with kubernetes_configuration as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                user_supplied_values, computed_values, hooks, manifests, notes = await asyncio.gather(
                    helm_service.get.user_supplied_values(
                        context_name=context_name, namespace=namespace, release_name=release_name
                    ),
                    helm_service.get.computed_values(
                        context_name=context_name, namespace=namespace, release_name=release_name
                    ),
                    helm_service.get.hooks(
                        context_name=context_name, namespace=namespace, release_name=release_name
                    ),
                    helm_service.get.manifest(
                        context_name=context_name, namespace=namespace, release_name=release_name
                    ),
                    helm_service.get.notes(
                        context_name=context_name, namespace=namespace, release_name=release_name
                    )
                )
                manifests_details = await asyncio.gather(*[
                    create_task(k8s_manager.get_details(
                        context_name=context_name,
                        namespace=manifest.metadata.namespace,
                        kind=manifest.kind,
                        name=manifest.metadata.name
                    ))
                    for manifest in manifests
                ])
                hooks_details = await asyncio.gather(*[
                    create_task(k8s_manager.get_details(
                        context_name=context_name,
                        namespace=hook.metadata.namespace,
                        kind=hook.kind,
                        name=hook.metadata.name
                    ))
                    for hook in hooks
                ])

        return {
            'user_supplied_values': user_supplied_values,
            'computed_values': computed_values,
            'hooks': [item for item in hooks_details if item is not None],
            'manifests': [item for item in manifests_details if item is not None],
            'notes': notes
        }

    async def uninstall_release(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> None:
        """
        Removes release.
        """
        kubernetes_configuration = self.organization_manager.get_kubernetes_configuration(organization)
        with kubernetes_configuration as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.uninstall.release(
                    context_name=context_name, namespace=namespace, release_name=release_name
                )
