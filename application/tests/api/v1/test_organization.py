from unittest import TestCase

import pytest
from httpx import AsyncClient

from constants.common import UNRECOGNIZED_CLOUD_PROVIDER_REGION
from constants.common import CloudProviders
from models.user import User
from tests.fixtures.cluster_configuration import aws_configuration
from tests.fixtures.cluster_configuration import azure_configuration
from tests.fixtures.cluster_configuration import gcp_configuration
from tests.fixtures.cluster_configuration import unknown_configuration


class TestOrganization:

    @pytest.mark.asyncio
    async def test_kubernetes_cofiguration(self, client: AsyncClient, current_user: User) -> None:
        test_case = TestCase()
        # Testing upload of different cloud providers configurations.
        response = await client.post('/organization/kubernetes-configuration', json=aws_configuration)
        assert 200 == response.status_code, 'Expected status 200.'
        response = await client.post('/organization/kubernetes-configuration', json=azure_configuration)
        assert 200 == response.status_code, 'Expected status 200.'
        response = await client.post('/organization/kubernetes-configuration', json=gcp_configuration)
        assert 200 == response.status_code, 'Expected status 200.'
        response = await client.post('/organization/kubernetes-configuration', json=unknown_configuration)
        assert 200 == response.status_code, 'Expected status 200.'

        response = await client.get('/organization/kubernetes-configuration')
        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        assert response_data['current_context'] == unknown_configuration['current-context']
        unknown, gcp, azure, aws = response_data['clusters']
        assert unknown['cloud_provider'] == CloudProviders.unrecognized
        assert unknown['region'] == UNRECOGNIZED_CLOUD_PROVIDER_REGION
        assert gcp['cloud_provider'] == CloudProviders.gcp
        assert gcp['region'] == 'us-central1-a'
        assert azure['cloud_provider'] == CloudProviders.azure
        assert azure['region'] == 'eastus'
        assert aws['cloud_provider'] == CloudProviders.aws
        assert aws['region'] == 'us-east-2'

        # Testing deletion of non existing context.
        response = await client.delete(
            '/organization/kubernetes-configuration/context',
            params={'context-name': 'non-existing-context'}
        )
        assert 404 == response.status_code, 'Expected status 404.'

        # Testing deletion of context.
        response = await client.delete(
            '/organization/kubernetes-configuration/context',
            params={'context-name': unknown_configuration['current-context']}
        )
        assert 200 == response.status_code, 'Expected status 200.'
        response = await client.get('/organization/kubernetes-configuration')
        assert 200 == response.status_code, 'Expected status 200.'
        response_data = response.json()
        assert len(response_data['contexts']) == 3
