from unittest import mock
from unittest.mock import Mock

import pytest
from httpx import AsyncClient

from constants.helm import ReleaseStatuses
from constants.kubernetes import K8sKinds
from exceptions.shell import NonZeroStatusException
from models.user import User
from services.helm.schemas import ManifestMetaSchema
from services.helm.schemas import ManifestSchema
from services.helm.schemas import ReleaseSchema
from services.kubernetes.schemas import K8sEntitySchema
from tests.fixtures.cluster_configuration import unknown_configuration
from tests.fixtures.k8s_deployment import kubernetes_deployment_details_fixture
from utils.kubernetes import KubernetesConfiguration


class TestHelm:

    @pytest.mark.asyncio
    async def test_empty_repository_list(self, client: AsyncClient, current_user: User) -> None:
        with mock.patch('application.services.helm.subcommands.base.run', autospec=True) as shell_call:
            with mock.patch('application.managers.organizations.manager.OrganizationManager.get_kubernetes_configuration') as organization_manager:
                organization_manager.return_value = KubernetesConfiguration(unknown_configuration)
                shell_call.side_effect = Mock(
                    side_effect=NonZeroStatusException(
                        command='helm repo list --output=yaml',
                        status_code=1,
                        stderr_message='Error: no repositories to show\n'
                    )
                )

                response = await client.get('/helm/repository/list')

        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        assert len(response_data) == 0

    @pytest.mark.asyncio
    async def test_add_repository(self, client: AsyncClient, current_user: User) -> None:
        data = {
            'name': 'mina',
            'url': 'https://coda-charts.storage.googleapis.com'
        }
        with mock.patch('application.services.helm.subcommands.base.run', autospec=True) as shell_call:
            with mock.patch('application.managers.organizations.manager.OrganizationManager.get_kubernetes_configuration') as organization_manager:
                organization_manager.return_value = KubernetesConfiguration(unknown_configuration)
                shell_call.return_value = '"mina" has been added to your repositories\n'
                response = await client.post('/helm/repository/add', json=data)

        assert 200 == response.status_code, 'Expected status 200.'

    @pytest.mark.asyncio
    async def test_repository_list(self, client: AsyncClient, current_user: User) -> None:
        with mock.patch('application.services.helm.subcommands.base.run', autospec=True) as shell_call:
            with mock.patch('application.managers.organizations.manager.OrganizationManager.get_kubernetes_configuration') as organization_manager:
                organization_manager.return_value = KubernetesConfiguration(unknown_configuration)
                shell_call.return_value = '- name: mina\n  url: https://coda-charts.storage.googleapis.com\n'
                response = await client.get('/helm/repository/list')

        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        assert len(response_data) == 1
        repository = response_data[0]
        assert 'name' in repository
        assert 'url' in repository
        assert repository['name'] == 'mina'
        assert repository['url'] == 'https://coda-charts.storage.googleapis.com'
        assert 200 == response.status_code, 'Expected status 200.'

    @pytest.mark.asyncio
    async def test_release_list(self, client: AsyncClient, current_user: User) -> None:
        with mock.patch('application.managers.organizations.manager.OrganizationManager.get_kubernetes_configuration') as organization_manager:
            with mock.patch('application.services.helm.subcommands.list.HelmList.releases', autospec=True) as releases:
                with mock.patch('application.services.helm.subcommands.get.HelmGet.manifest') as manifest:
                    with mock.patch('application.managers.kubernetes.K8sManager.get_details') as details:
                        organization_manager.return_value = KubernetesConfiguration(unknown_configuration)
                        releases.return_value = [
                            ReleaseSchema(
                                application_version='1.0',
                                chart='nginx-1.0.0',
                                name='release-name-1',
                                namespace='release-namespace',
                                revision='1',
                                status=ReleaseStatuses.deployed,
                                updated='2022-06-01 12:46:15.24955073 +0000 UTC'
                            )
                        ]
                        manifest.return_value = [
                            ManifestSchema(
                                api_version='1',
                                kind=K8sKinds.deployment,
                                metadata=ManifestMetaSchema(name='entity-name', namespace='release-namespace'),
                                specification={}
                            )
                        ]
                        details.return_value = K8sEntitySchema.parse_obj(kubernetes_deployment_details_fixture)
                        response = await client.get('/helm/release/list')

        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        assert isinstance(response_data, list)
        assert len(response_data) == 1
        release = response_data[0]
        assert release['name'] == 'release-name-1'
        assert release['updated'] == 1654087575.24955
        assert release['context_name'] == 'some-context'
