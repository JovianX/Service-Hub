"""
Manager for helm business logic.
"""
import asyncio
import base64
import shutil
from asyncio import create_task
from collections.abc import Iterable
from datetime import timedelta
from uuid import uuid4

from constants.helm import ReleaseHealthStatuses
from constants.kubernetes import K8sKinds
from exceptions.kubernetes import ClusterUnreachableException
from managers.kubernetes import K8sManager
from managers.organizations.manager import OrganizationManager
from models.organization import Organization
from services.helm.facade import HelmService
from services.helm.schemas import ChartSchema
from services.kubernetes.schemas import K8sEntitySchema
from utils.achive import tar
from utils.helm import HelmArchive
from utils.paths import organization_home


class HelmManager:
    """
    Manager to manipulate helm.
    """
    organization_manager: OrganizationManager

    def __init__(self, organization_manager: OrganizationManager):
        self.organization_manager = organization_manager

    ############################################################################
    # Repositories
    ############################################################################

    async def add_repository(self, organization: Organization, name: str, url: str) -> None:
        """
        Adds user charts repository.
        """
        async with HelmArchive(organization, self.organization_manager) as helm_home:
            helm_service = HelmService(kubernetes_configuration='', helm_home=helm_home)
            await helm_service.repository.add(name, url)

    async def list_repositories(self, organization: Organization) -> list[dict]:
        """
        Lists repositories added user.
        """
        async with HelmArchive(organization, self.organization_manager) as helm_home:
            helm_service = HelmService(kubernetes_configuration='', helm_home=helm_home)

            return await helm_service.repository.list()

    async def delete_repository(self, organization: Organization, name: str) -> None:
        """
        Removes Helm repository.
        """
        async with HelmArchive(organization, self.organization_manager) as helm_home:
            helm_service = HelmService(kubernetes_configuration='', helm_home=helm_home)
            await helm_service.repository.remove(name)

    ############################################################################
    # Charts
    ############################################################################

    async def install_chart(
        self, organization: Organization, context_name: str, namespace: str, release_name: str, chart_name: str,
        values: list[dict] | dict | None = None, version: str | None = None, description: str | None = None,
        dry_run: bool = False
    ) -> str:
        """
        Installs given chart.
        """
        debug = False
        if dry_run:
            debug = True
        if isinstance(values, dict):
            values = [values]
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.repository.update()
                return await helm_service.install.chart(
                    context_name=context_name,
                    namespace=namespace,
                    release_name=release_name,
                    chart_name=chart_name,
                    version=version,
                    values=values,
                    description=description,
                    debug=debug,
                    dry_run=dry_run
                )

    async def list_repositories_charts(self, organization: Organization) -> list[ChartSchema]:
        """
        Returns lists of charts in all repositories.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.repository.update()
                return await helm_service.search.charts()

    async def list_chart_versions(self, organization: Organization, chart_name: str, include_unstable: bool = False,
                                  version_filter: str | None = None) -> list[ChartSchema]:
        """
        List versions of chart.
        """
        async with HelmArchive(organization, self.organization_manager) as helm_home:
            helm_service = HelmService(kubernetes_configuration='', helm_home=helm_home)
            await helm_service.repository.update()
            return await helm_service.search.charts(
                chart_name,
                list_versions=True,
                show_development_versions=include_unstable,
                version_filter=version_filter
            )

    async def chart_defaults(self, organization: Organization, chart_name: str) -> str:
        """
        Returns default chart values(content of values.yaml file).
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.repository.update()
                return await helm_service.show.values(chart_name)

    ############################################################################
    # Releases
    ############################################################################

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
                for context_name in kubernetes_configuration.contexts:
                    try:
                        releases = await helm_service.list.releases(context_name, namespace)
                    except ClusterUnreachableException:
                        continue
                    for release in releases:
                        item = release.dict()
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

    async def list_available_charts(self, organization: Organization, application_name: str) -> list[dict]:
        """
        Returns list of available charts from different repositories with which release can be updated.
        """
        charts = await self.list_repositories_charts(organization)

        return [chart.dict() for chart in charts if chart.application_name == application_name]

    async def get_user_supplied_values(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> dict | list | None:
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
    ) -> dict | list | None:
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
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                health_status = await self._release_health_status(
                    helm_service, k8s_manager, context_name, namespace, release_name
                )

        return health_status

    async def list_unhealthy_releases(self, organization: Organization) -> list[dict]:
        """
        Returns list of unhealthy releases.
        """
        releases = await self.list_releases(organization)
        if not releases:
            return []
        unhealthy_releases = []
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                k8s_manager = K8sManager(k8s_config_path)
                health_statuses = await asyncio.gather(*[
                    self._release_health_status(
                        helm_service, k8s_manager, release['context_name'], release['namespace'], release['name']
                    )
                    for release in releases
                ])
                for release, health_status in zip(releases, health_statuses):
                    if health_status['status'] == ReleaseHealthStatuses.unhealthy:
                        unhealthy_releases.append(release)

        return unhealthy_releases

    async def update_release(
        self, organization: Organization, context_name: str, namespace: str, release_name: str,
        values: dict, chart: str | None = None, dry_run: bool = False
    ):
        """
        Updates release values. Chart can be provided as repository
        reference(repository-name/chart-name). If omitted chart will be
        recreated from release if it possible.
        """
        debug = False
        if dry_run:
            debug = True
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                if chart:
                    await helm_service.repository.update()
                else:
                    destination = organization_home(organization) / 'dumped_charts' / str(uuid4())
                    chart = await helm_service.release.create_chart(
                        context_name=context_name,
                        namespace=namespace,
                        release_name=release_name,
                        targer_directory=destination
                    )
                    await helm_service.dependency.build(
                        context_name=context_name,
                        namespace=namespace,
                        chart_directory=chart
                    )
                return await helm_service.upgrade.release(
                    context_name=context_name,
                    namespace=namespace,
                    release_name=release_name,
                    chart=chart,
                    values=[values],
                    debug=debug,
                    dry_run=dry_run
                )

    async def get_release_chart(self, organization: Organization, context_name: str, namespace: str, release_name: str):
        """
        Creates chart for existing release.
        """
        destination = organization_home(organization) / 'dumped_charts' / str(uuid4())
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                chart_directory = await helm_service.release.create_chart(
                    context_name,
                    namespace,
                    release_name,
                    destination
                )
        archive = await tar(chart_directory)
        shutil.rmtree(destination)

        return {
            'filename': f'{chart_directory.name}.tar.gz',
            'archive': base64.b64encode(archive)
        }

    async def uninstall_release(
        self, organization: Organization, context_name: str, namespace: str, release_name: str, dry_run: bool = False
    ) -> None:
        """
        Removes release.
        """
        debug = False
        if dry_run:
            debug = True
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.uninstall.release(
                    context_name=context_name,
                    namespace=namespace,
                    release_name=release_name,
                    debug=debug,
                    dry_run=dry_run
                )

    ############################################################################
    # Release TTL
    ############################################################################

    async def set_release_ttl(
        self, organization: Organization, context_name: str, namespace: str, release_name: str, minutes: int
    ) -> None:
        """
        Set release TTL(time to live).
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.release.set_ttl(
                    context_name=context_name,
                    namespace=namespace,
                    release_name=release_name,
                    time_delta=timedelta(minutes=minutes)
                )

    async def read_release_ttl(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> None:
        """
        Reads release TTL(time to live). Returns date and time when release will be deleted.
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                return await helm_service.release.read_ttl(
                    context_name=context_name,
                    namespace=namespace,
                    release_name=release_name
                )

    async def delete_release_ttl(
        self, organization: Organization, context_name: str, namespace: str, release_name: str
    ) -> None:
        """
        Deletes  release TTL(time to live).
        """
        with self.organization_manager.get_kubernetes_configuration(organization) as k8s_config_path:
            async with HelmArchive(organization, self.organization_manager) as helm_home:
                helm_service = HelmService(kubernetes_configuration=k8s_config_path, helm_home=helm_home)
                await helm_service.release.unset_ttl(
                    context_name=context_name,
                    namespace=namespace,
                    release_name=release_name
                )

    ############################################################################
    # Misc
    ############################################################################

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

    async def _release_health_status(
        self, helm_service: HelmService, k8s_manager: K8sManager, context_name: str, namespace: str, release_name: str
    ) -> dict[str, ReleaseHealthStatuses | dict[str, dict[str, bool]]]:
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
