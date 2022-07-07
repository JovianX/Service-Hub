"""
Business logic of Service catalog.

Services from Service catalog describes deployed services. For example it can
describe how to reach some endpoint: IP address/host, post, path, HTTP method,
payload example etc. Or do periodic health check.
"""
from fastapi import Depends

from application.constants.services import ServiceTypes
from application.crud.services import ServiceDatabase
from application.crud.services import get_service_db
from application.models.organization import Organization
from application.models.service import Service
from application.models.user import User

from .schemas import HTTPEndpointHealthCheckSettingsSchema
from .schemas import KubernetesResourceHealthCheckSettingsSchema


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
        if type in (ServiceTypes.kubernetes_ingress, ServiceTypes.kubernetes_service):
            KubernetesResourceHealthCheckSettingsSchema.parse_obj(settings)
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

    async def delete_service(self, service_id: int) -> None:
        """
        Deletes service.
        """
        await self.db.delete_by_id(service_id)


async def get_service_manager(db=Depends(get_service_db)):
    yield ServiceManager(db)
