import contextlib

from sqlalchemy.ext.asyncio import AsyncSession

from crud.organizations import get_organization_db
from crud.users import get_user_db
from managers.organizations.manager import get_organization_manager
from managers.users import get_user_manager
from models.user import User
from schemas.users import UserCreate


get_organization_db_context = contextlib.asynccontextmanager(get_organization_db)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)

get_organization_manager_context = contextlib.asynccontextmanager(get_organization_manager)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


async def create_user(session: AsyncSession, email: str, password: str, is_superuser: bool = False):
    async with get_organization_db_context(session) as organization_db:
        async with get_user_db_context(session) as user_db:
            async with get_organization_manager_context(organization_db) as organization_manager:
                async with get_user_manager_context(user_db, organization_manager) as user_manager:
                    return await user_manager.create(
                        UserCreate(email=email, password=password, is_superuser=is_superuser)
                    )


async def delete_user(session: AsyncSession, user: User):
    async with get_organization_db_context(session) as organization_db:
        async with get_user_db_context(session) as user_db:
            async with get_organization_manager_context(organization_db) as organization_manager:
                async with get_user_manager_context(user_db, organization_manager) as user_manager:
                    return await user_manager.delete(user)
