from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from constants.kubernetes import K8sKinds
from core.authentication import current_active_user
from managers.kubernetes import K8sManager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from models.user import User


router = APIRouter()


@router.get('/namespace/list', response_model=list[dict])
async def list_namespaces(
    context_name: str = Query(description='Name of context name to use.'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List of all namespaces available for given context.
    """
    kubernetes_configuration = organization_manager.get_kubernetes_configuration(user.organization)
    with kubernetes_configuration as k8s_config_path:
        k8s_manager = K8sManager(k8s_config_path)
        namespaces = await k8s_manager.list(context_name, K8sKinds.namespace)
    return [
        {
            'name': namespace.metadata['name'],
            'status': namespace.status['phase']
        }
        for namespace in namespaces
    ]


@router.get('/ingress/list', response_model=list[dict])
async def list_ingresses(
    context_name: str = Query(description='Name of context name to use.'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List of all ingresses available for given context.
    """
    kubernetes_configuration = organization_manager.get_kubernetes_configuration(user.organization)
    with kubernetes_configuration as k8s_config_path:
        k8s_manager = K8sManager(k8s_config_path)
        ingresses = await k8s_manager.list(context_name, K8sKinds.ingress)
    return [
        {
            'name': ingress.metadata['name'],
            'namespace': ingress.metadata['namespace']
        }
        for ingress in ingresses
    ]


@router.get('/service/list', response_model=list[dict])
async def list_services(
    context_name: str = Query(description='Name of context name to use.'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List of all services available for given context.
    """
    kubernetes_configuration = organization_manager.get_kubernetes_configuration(user.organization)
    with kubernetes_configuration as k8s_config_path:
        k8s_manager = K8sManager(k8s_config_path)
        services = await k8s_manager.list(context_name, K8sKinds.service)
    return [
        {
            'name': service.metadata['name'],
            'namespace': service.metadata['namespace']
        }
        for service in services
    ]
