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
        Updates cache of user repositories.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.repository.update()
                return await helm_service.search.repositories()

    async def list_releases(self, organization: Organization, namespace: str = None) -> List[ReleaseListItemSchema]:
        """
        List releases in namespace if it is present otherwise in all namespaces
        using default context in kubernetes configuration.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                releases = await helm_service.list.releases(namespace)

                async def get_entity_details(release_name, namespace):
                    manifests = await helm_service.get.manifest(release_name, namespace)
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
                            kind=manifest.kind,
                            namespace=manifest.metadata.namespace,
                            name=manifest.metadata.name
                        ))
                        for manifest in manifests if manifest.kind in kind_to_check
                    ])

                releases_entities_details = await asyncio.gather(*[
                    create_task(get_entity_details(release.name, release.namespace))
                    for release in releases
                ])
        items = []
        for release, entities_details in zip(releases, releases_entities_details):
            item = release.dict()
            item['health_status'] = ReleaseHealthStatuses.healthy
            item['entities_health_status'] = {}
            configuration = self.organization_manager.get_setting(organization, 'kubernetes_configuration')
            item['cluster'] = configuration.current_context
            for entity in entities_details:
                entity_is_healthy = entity.is_healthy
                entity_name = entity.metadata['name']
                if entity_is_healthy is not None:
                    item['entities_health_status'].setdefault(entity.kind, {})[entity_name] = entity_is_healthy
                    if not entity_is_healthy:
                        item['health_status'] = ReleaseHealthStatuses.unhealthy
            items.append(item)

        return items
