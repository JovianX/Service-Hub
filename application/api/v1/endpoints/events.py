"""
Events endpoints.
"""
from fastapi import APIRouter
from fastapi import Depends
from fastapi import Path
from fastapi import Query

from constants.events import EventCategory
from core.authentication import AuthorizedUser
from core.authentication import OperatorRolePermission
from core.authentication import current_active_user
from managers.events import EventManager
from managers.events import get_event_manager
from models.user import User
from schemas.events import EventSchema

from ..schemas.events import ObjectIdentifiersQuerySchema


router = APIRouter()


@router.get(
    '/list/{category}',
    response_model=list[EventSchema],
    dependencies=[Depends(AuthorizedUser(OperatorRolePermission))]
)
async def get_category_events(
    category: EventCategory = Path(title='Category of events.'),
    object_identifier: ObjectIdentifiersQuerySchema = Depends(),
    user: User = Depends(current_active_user),
    event_manager: EventManager = Depends(get_event_manager)
):
    """
    Returns list of events of specific category.
    """
    return await event_manager.list_organization_events(
        user.organization,
        category,
        **object_identifier.dict(exclude_unset=True)
    )
