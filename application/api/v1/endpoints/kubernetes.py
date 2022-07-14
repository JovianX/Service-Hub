from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from application.core.authentication import current_active_user
from application.managers.kubernetes import K8sManager
from application.managers.organizations.manager import OrganizationManager
from application.managers.organizations.manager import get_organization_manager
from application.models.user import User


router = APIRouter()


@router.get('/namespace/list', response_model=list[dict])
async def list_releases(
    context_name: str = Query(description='Name of context name to use.'),
    user: User = Depends(current_active_user),
    organization_manager: OrganizationManager = Depends(get_organization_manager)
):
    """
    List releases in all namespaces using default context.
    """
    kubernetes_configuration = organization_manager.get_kubernetes_configuration(user.organization)
    with kubernetes_configuration as k8s_config_path:
        k8s_manager = K8sManager(k8s_config_path)
        namespaces = await k8s_manager.list_namespaces(context_name)
    return [
        {
            'name': namespace.metadata['name'],
            'status': namespace.status['phase']
        }
        for namespace in namespaces
    ]
