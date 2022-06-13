from fastapi import APIRouter
from fastapi import Depends

from application.core.authentication import current_active_user
from application.models.user import User
from application.schemas.helm import HelmRepositorySchema
from application.services.helm.manager import HelmManager


router = APIRouter()


@router.post('/repository/add')
async def add_repository(data: HelmRepositorySchema, user: User = Depends(current_active_user)):
    """
    Add helm charts repository.
    """
    helm_manager = HelmManager(user)
    await helm_manager.repository.add(data.name, data.url)


@router.get('/repository/list')
async def list_repository(user: User = Depends(current_active_user)):
    """
    List all helm charts repositories.
    """
    helm_manager = HelmManager(user)
    repositories = await helm_manager.repository.list()

    return {'data': repositories}


@router.get('/chart/list')
async def list_charts_in_repsitories(user: User = Depends(current_active_user)):
    """
    List all charts in all repositories.
    """
    helm_manager = HelmManager(user)
    repositories = await helm_manager.search.repositories()

    return {'data': repositories}
