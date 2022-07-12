"""
Manager for helm business logic.
"""
import asyncio
from asyncio import create_task
from collections.abc import Iterable

from application.constants.helm import ReleaseHealthStatuses
from application.constants.kubernetes import K8sKinds
from application.managers.kubernetes import K8sManager
from application.managers.organizations.manager import OrganizationManager
from application.models.organization import Organization
from application.services.helm.facade import HelmService
from application.services.kubernetes.schemas import K8sEntitySchema
from application.utils.helm import HelmArchive


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

    async def list_repositories(self, organization: Organization) -> list[dict]:
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

    async def list_releases(self, organization: Organization, namespace: str | None = None) -> list[dict]:
        """
        List releases in namespace if it is present otherwise in all namespaces
        using default context in kubernetes configuration.
        """
        items = []
        kubernetes_configuration = self.organization_manager.get_kubernetes_configuration(organization)
        with kubernetes_configuration as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                for context_name in kubernetes_configuration.context_names:
                    releases, charts = await asyncio.gather(
                        helm_service.list.releases(context_name, namespace),
                        self.list_repositories_charts(organization)
                    )
                    for release in releases:
                        item = release.dict()
                        item['available_chart'] = next(
                            ({'chart_name': chart.name, 'chart_version': chart.version}
                             for chart in charts if chart.chart_name == release.chart_name),
                            None
                        )
                        item['context_name'] = context_name
                        items.append(item)

        return items

    async def releases_count(self, organization: Organization) -> int:
        """
        Returns count of releases for all available clusters in all namespaces.
        """
        kubernetes_configuration = self.organization_manager.get_kubernetes_configuration(organization)
        with kubernetes_configuration as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                releases = await asyncio.gather(
                    *[helm_service.list.releases(context_name) for context_name in kubernetes_configuration.contexts]
                )

        return sum([len(item) for item in releases])

    async def get_user_supplied_values(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> dict:
        """
        Returns release values supplied by user during chart install.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                user_supplied_values = await helm_service.get.user_supplied_values(
                    context_name=context_name, namespace=namespace, release_name=release_name
                )

        return user_supplied_values

    async def get_computed_values(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> dict:
        """
        Returns release final release values.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                computed_values = await helm_service.get.computed_values(
                    context_name=context_name, namespace=namespace, release_name=release_name
                )

        return computed_values

    async def get_detailed_hooks(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> list[K8sEntitySchema]:
        """
        Returns release hooks extended with details from Kubernetes.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                detailed_hooks = await self._get_detailed_hooks(
                    helm_service, k8s_manager, context_name, namespace, release_name
                )

        return detailed_hooks

    async def get_detailed_manifest(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> list[K8sEntitySchema]:
        """
        Returns release manifest extended with details from Kubernetes.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                detailed_manifest = await self._get_detailed_manifest(
                    helm_service, k8s_manager, context_name, namespace, release_name
                )

        return detailed_manifest

    async def get_notes(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> str:
        """
        Returns release notes.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                notes = await helm_service.get.notes(
                    context_name=context_name, namespace=namespace, release_name=release_name
                )

        return notes

    async def release_health_status(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> dict:
        """
        Returns health status of release and health details for each release entity.
        """
        kinds_to_check = (
            K8sKinds.daemon_set,
            K8sKinds.deployment,
            K8sKinds.replica_set,
            K8sKinds.replication_controller,
            K8sKinds.service,
            K8sKinds.stateful_set,
        )
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                entities_details = await self._get_detailed_manifest(
                    helm_service, k8s_manager, context_name, namespace, release_name, kinds_to_check
                )

        health_details = {}
        health_status = ReleaseHealthStatuses.healthy
        for entity in entities_details:
            if entity.is_healthy is None:
                continue
            entity_name = entity.metadata['name']
            kind_health_statuses = health_details.setdefault(entity.kind, {})
            kind_health_statuses[entity_name] = entity.is_healthy
            if not entity.is_healthy:
                health_status = ReleaseHealthStatuses.unhealthy

        return {
            'status': health_status,
            'details': health_details
        }

    async def computed_values(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> dict:
        """
        Returns release computed values.
        """
        kubernetes_configuration = self.organization_manager.get_kubernetes_configuration(organization)
        with kubernetes_configuration as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                computed_values = await helm_service.get.computed_values(
                    context_name=context_name, namespace=namespace, release_name=release_name
                )

        return computed_values

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

    async def _get_detailed_manifest(
        self,
        helm_service: HelmService,
        k8s_manager: K8sManager,
        context_name: str,
        namespace: str,
        release_name: str,
        kinds_to_fetch: Iterable[K8sKinds] = None
    ) -> list[K8sEntitySchema]:
        """
        Returns list of Helm manifest entities extended with details from
        Kubernetes.
        """
        resources = await helm_service.get.manifest(context_name, namespace, release_name)
        if not kinds_to_fetch:
            # No limit was given. Fetching all entities.
            kinds_to_fetch = set(K8sKinds)
        resources_details = await asyncio.gather(*[
            create_task(k8s_manager.get_details(
                context_name=context_name,
                namespace=namespace,
                kind=resource.kind,
                name=resource.metadata.name
            ))
            for resource in resources if resource.kind in kinds_to_fetch
        ])

        return [item for item in resources_details if item is not None]

    async def _get_detailed_hooks(
        self,
        helm_service: HelmService,
        k8s_manager: K8sManager,
        context_name: str,
        namespace: str,
        release_name: str,
        kinds_to_fetch: Iterable[K8sKinds] = None
    ) -> list[K8sEntitySchema]:
        """
        Returns list of Helm hooks manifest entities extended with details from
        Kubernetes.
        """
        resources = await helm_service.get.hooks(context_name, namespace, release_name)
        if not kinds_to_fetch:
            # No limit was given. Fetching all entities.
            kinds_to_fetch = set(K8sKinds)
        resources_details = await asyncio.gather(*[
            create_task(k8s_manager.get_details(
                context_name=context_name,
                namespace=namespace,
                kind=resource.kind,
                name=resource.metadata.name
            ))
            for resource in resources if resource.kind in kinds_to_fetch
        ])

        return [item for item in resources_details if item is not None]
