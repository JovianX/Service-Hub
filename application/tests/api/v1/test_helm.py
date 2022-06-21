from unittest import mock
from unittest.mock import Mock

import pytest
from httpx import AsyncClient

from application.exceptions.shell import NonZeroStatusException
from application.models.user import User
from application.utils.kubernetes import KubernetesConfigurationFile


class TestHelm:

    @pytest.mark.asyncio
    async def test_empty_repository_list(self, client: AsyncClient, current_user: User) -> None:
        with mock.patch('application.services.helm.subcommands.base.run', autospec=True) as shell_call:
            with mock.patch('application.managers.organizations.manager.OrganizationManager.get_kubernetes_configuration') as organization_manager:
                organization_manager.return_value = KubernetesConfigurationFile({})
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
        assert 'data' in response_data
        assert len(response_data['data']) == 0

    @pytest.mark.asyncio
    async def test_add_repository(self, client: AsyncClient, current_user: User) -> None:
        data = {
            'name': 'mina',
            'url': 'https://coda-charts.storage.googleapis.com'
        }
        with mock.patch('application.services.helm.subcommands.base.run', autospec=True) as shell_call:
            with mock.patch('application.managers.organizations.manager.OrganizationManager.get_kubernetes_configuration') as organization_manager:
                organization_manager.return_value = KubernetesConfigurationFile({})
                shell_call.return_value = '"mina" has been added to your repositories\n'
                response = await client.post('/helm/repository/add', json=data)

        assert 200 == response.status_code, 'Expected status 200.'

    @pytest.mark.asyncio
    async def test_repository_list(self, client: AsyncClient, current_user: User) -> None:
        with mock.patch('application.services.helm.subcommands.base.run', autospec=True) as shell_call:
            with mock.patch('application.managers.organizations.manager.OrganizationManager.get_kubernetes_configuration') as organization_manager:
                organization_manager.return_value = KubernetesConfigurationFile({})
                shell_call.return_value = '- name: mina\n  url: https://coda-charts.storage.googleapis.com\n'
                response = await client.get('/helm/repository/list')

        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        assert 'data' in response_data
        assert len(response_data['data']) == 1
        repository = response_data['data'][0]
        assert 'name' in repository
        assert 'url' in repository
        assert repository['name'] == 'mina'
        assert repository['url'] == 'https://coda-charts.storage.googleapis.com'
