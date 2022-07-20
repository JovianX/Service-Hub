"""
Business logic of Service catalog.

Services from Service catalog describes deployed services. For example it can
describe how to reach some endpoint: IP address/host, post, path, HTTP method,
payload example etc. Or do periodic health check.
"""
import asyncio

from fastapi import Depends
from httpx import AsyncClient
from httpx import TransportError

from application.constants.kubernetes import K8sKinds
from application.constants.services import ServiceHealthStatuses
from application.constants.services import ServiceTypes
from application.crud.services import ServiceDatabase
from application.crud.services import get_service_db
from application.exceptions.common import CommonException
from application.exceptions.service import ServiceDoesNotExistException
from application.managers.kubernetes import K8sManager
from application.managers.organizations.manager import OrganizationManager
from application.models.organization import Organization
from application.models.service import Service
from application.models.user import User

from .schemas import HTTPEndpointHealthCheckSettingsSchema
from .schemas import KubernetesIngressHealthCheckSettingsSchema
from .schemas import KubernetesServiceHealthCheckSettingsSchema


class ServiceManager:
    """
    Manager of services from Sevice catalog.
    """

    db: ServiceDatabase

    def __init__(self, db: ServiceDatabase):
        self.db = db

    async def create_service(
        self, creator: User, type: ServiceTypes, name: str, settings: dict, description: str | None = ''
    ) -> Service:
        """
        Creates new service in service catalog.
        """
        if type == ServiceTypes.kubernetes_ingress:
            KubernetesIngressHealthCheckSettingsSchema.parse_obj(settings)
        elif type == ServiceTypes.kubernetes_service:
            KubernetesServiceHealthCheckSettingsSchema.parse_obj(settings)
        elif type == ServiceTypes.http_endpoint:
            HTTPEndpointHealthCheckSettingsSchema.parse_obj(settings)
        else:
            raise ValueError(f'Invalid service type: "{type}".')

        service = {
            'name': name,
            'description': description,
            'health_check_settings': settings,
            'type': type,
            'creator_id': str(creator.id),
            'organization_id': creator.organization.id
        }
        return await self.db.create(service)

    async def list_organization_service(self, organization: Organization):
        """
        Lists all organization's services.
        """
        services = await self.db.list_by_organization(organization.id)

        return services

    async def delete_service(self, service_id: int, organization: Organization) -> None:
        """
        Deletes service.
        """
        await self.db.delete_organization_service(organization.id, service_id)

    async def check_health(
        self,
        service_id: int,
        organization: Organization,
        organization_manager: OrganizationManager
    ):
        """
        Checks service health status.
        """
        service_record: Service = await self.db.get(id=service_id, organization_id=organization.id)
        settings = service_record.health_check_settings
        if service_record.type == ServiceTypes.kubernetes_ingress:
            context_name = settings['context_name']
            namespace = settings['namespace']
            ingress_name = settings['ingress_name']
            method = settings['method']
            path = settings['path']
            timeout = settings['timeout']
            headers = settings['headers']
            with organization_manager.get_kubernetes_configuration(organization) as configuration_path:
                k8s_manager = K8sManager(configuration_path)
                details = await k8s_manager.get_details(
                    context_name=context_name, namespace=namespace, kind=K8sKinds.ingress, name=ingress_name
                )
                services = []
                for rule in details.specification['rules']:
                    for path in rule['http']['paths']:
                        service = path['backend']['service']
                        service_name = service['name']
                        service_port = None
                        if service['port'].get('name') == 'http':
                            service_port = 80
                        elif service['port'].get('name') == 'https':
                            # Skipping 443 port. Internal Kubernetes proxy incorrencly processes https requests.
                            # It sends plain http on 443 port.
                            pass
                        elif service['port'].get('number'):
                            service_port = service['port']['number']
                        else:
                            raise ValueError(
                                f'Failed to check status for "{service_record.name}" service. Unprocessable Kubernetes '
                                f'ingress, unable to extract port.'
                            )
                        if service_port:
                            services.append({'service_name': service_name, 'service_port': service_port})
                responses = await asyncio.gather(*[
                    k8s_manager.make_service_proxy_request(
                        context_name=context_name,
                        namespace=namespace,
                        service_name=f"{service['service_name']}:{service['service_port']}",
                        method=method,
                        path=path,
                        headers=headers,
                        timeout=timeout)
                    # Kubernetes internal proxy doesn't know how to work with HTTPS requests.
                    for service in services
                ])
                for status_code, message in responses:
                    if status_code >= 300 or status_code < 200:
                        return ServiceHealthStatuses.unhealthy
                else:
                    return ServiceHealthStatuses.healthy
        elif service_record.type == ServiceTypes.kubernetes_service:
            context_name = settings['context_name']
            namespace = settings['namespace']
            service_name = settings['service_name']
            method = settings['method']
            path = settings['path']
            headers = settings['headers']
            timeout = settings['timeout']
            with organization_manager.get_kubernetes_configuration(organization) as configuration_path:
                k8s_manager = K8sManager(configuration_path)
                details = await k8s_manager.get_details(
                    context_name=context_name, namespace=namespace, kind=K8sKinds.service, name=service_name
                )
                ports = [item['port'] for item in details.specification.get('ports', []) if item.get('port')]
                if not ports:
                    raise CommonException(
                        f'Failed to check health status of service "{service_record.name}". Kubernetes entity '
                        f'"Service" does not have ports.'
                    )
                responses = await asyncio.gather(*[
                    k8s_manager.make_service_proxy_request(
                        context_name=context_name,
                        namespace=namespace,
                        service_name=f'{service_name}:{port}',
                        method=method,
                        path=path,
                        headers=headers,
                        timeout=timeout)
                    # Kubernetes internal proxy doesn't know how to work with HTTPS requests.
                    for port in ports if port not in (443, 8443)
                ])
                for status_code, message in responses:
                    if 300 <= status_code < 200:
                        return ServiceHealthStatuses.unhealthy
                else:
                    return ServiceHealthStatuses.healthy
        elif service_record.type == ServiceTypes.http_endpoint:
            method = settings['method']
            parameters = settings['parameters']
            body = settings['body']
            headers = settings['headers']
            timeout = settings['timeout']
            url = settings['url']
            async with AsyncClient() as client:
                try:
                    response = await client.request(
                        method, url, params=parameters, json=body, headers=headers, timeout=timeout
                    )
                except TransportError:
                    return ServiceHealthStatuses.unhealthy
            if 200 <= response.status_code < 300:
                return ServiceHealthStatuses.healthy
            else:
                return ServiceHealthStatuses.unhealthy
        else:
            raise ValueError(f'Unknown service type "{service_record.type}".')


async def get_service_manager(db=Depends(get_service_db)):
    yield ServiceManager(db)
