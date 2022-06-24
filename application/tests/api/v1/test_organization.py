from datetime import datetime
from unittest import mock
from unittest.mock import Mock
from unittest import TestCase
from xml.dom import NOT_FOUND_ERR

import pytest
from httpx import AsyncClient

from application.exceptions.shell import NonZeroStatusException
from application.models.user import User
from application.tests.fixtures.cluster_configuration import cluster_configuration
from application.tests.fixtures.cluster_configuration import cluster_configuration_2
from application.utils.kubernetes import KubernetesConfigurationFile


class TestOrganization:

    @pytest.mark.asyncio
    async def test_kubernetes_cofiguration(self, client: AsyncClient, current_user: User) -> None:
        test_case = TestCase()
        # Testing first configuration upload.
        response = await client.post('/organization/settings/kubernetes_configuration', json=cluster_configuration)
        assert 200 == response.status_code, 'Expected status 200.'
        response = await client.get('/organization/settings/kubernetes_configuration')
        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        test_case.assertDictEqual(response_data, cluster_configuration)

        # Testing second configuration upload.
        response = await client.post('/organization/settings/kubernetes_configuration', json=cluster_configuration_2)
        assert 200 == response.status_code, 'Expected status 200.'
        response = await client.get('/organization/settings/kubernetes_configuration')
        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        assert 'current-context' in response_data
        assert response_data['current-context'] == 'other-context'
        for node_name in ('clusters', 'contexts', 'users'):
            assert isinstance(response_data.get(node_name), list)
            test_case.assertCountEqual(
                response_data[node_name],
                cluster_configuration[node_name] + cluster_configuration_2[node_name]
            )

        # Testing deletion of non existing context.
        response = await client.delete(
            '/organization/settings/kubernetes-configuration/context',
            params={'context-name': 'non-existing-context'}
        )
        assert 404 == response.status_code, 'Expected status 404.'

        # Testing deletion of context.
        response = await client.delete(
            '/organization/settings/kubernetes-configuration/context',
            params={'context-name': 'other-context'}
        )
        assert 200 == response.status_code, 'Expected status 200.'
        response = await client.get('/organization/settings/kubernetes_configuration')
        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        test_case.assertCountEqual(
            response_data['contexts'],
            cluster_configuration['contexts']
        )
