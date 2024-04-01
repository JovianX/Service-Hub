"""
Manager for http business logic.
"""


import httpx
from fastapi import Depends

from constants.http import ComponentTypeHttpMethods
from exceptions.http import HttpException
from exceptions.http import HttpNotOk
from managers.events import EventManager
from managers.events import get_event_manager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager


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
            if method.lower() in ComponentTypeHttpMethods:
                response = await client.request(method, url, params=parameters, headers=headers)
            else:
                raise HttpException(f"Unsupported method: {method}")

        # Check the response status code
        if not 200 <= response.status_code < 300:
            raise HttpNotOk(f"Request failed with status {response.status_code}")
        # Return the response text
        return response.text


async def get_http_manager(
    organization_manager=Depends(get_organization_manager),
    event_manager=Depends(get_event_manager)
):
    yield HttpManager(organization_manager, event_manager)
