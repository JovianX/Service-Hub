"""
Manager for http business logic.
"""


import httpx
from fastapi import Depends

from constants.events import EventCategory
from exceptions.http import HttpException
from managers.events import EventManager
from managers.events import get_event_manager
from managers.kubernetes import K8sManager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from models.organization import Organization
from schemas.events import EventSchema
from services.helm.facade import HelmService


class HttpManager:
    """
    Manager to manipulate Http requests.
    """
    organization_manager: OrganizationManager

    def __init__(self, organization_manager: OrganizationManager, event_manager: EventManager):
        self.organization_manager = organization_manager
        self.event_manager = event_manager

    ############################################################################
    # Http Requests
    ############################################################################

    async def http_request(
        self, component_name: str, url: str, method: str,
        parameters: dict | list, headers: dict = None, dry_run: bool = False
    ) -> str:
        """
        Send an HTTP request to the specified URL.
        """
        # Convert to a dict if a list of dicts provided
        if isinstance(parameters, list):
            parameters = {k: v for d in parameters for k, v in d.items()}

        # Create an HTTP client
        async with httpx.AsyncClient() as client:
            # Prepare the request
            method = method.lower()
            match method:
                case 'get':
                    response = await client.get(url, params=parameters, headers=headers)
                case 'post':
                    response = await client.post(url, params=parameters, headers=headers)
                case 'put':
                    response = await client.put(url, params=parameters, headers=headers)
                case 'delete':
                    response = await client.delete(url, params=parameters, headers=headers)
                case 'patch':
                    response = await client.patch(url, params=parameters, headers=headers)
                case _:
                    raise HttpException(f"Unsupported method: {method}")

        # Check the response status code
        if not 200 <= response.status_code < 300:
            raise Exception(f"Request failed with status {response.status_code}")
        # Return the response text
        return response.text


async def get_http_manager(
    organization_manager=Depends(get_organization_manager),
    event_manager=Depends(get_event_manager)
):
    yield HttpManager(organization_manager, event_manager)
