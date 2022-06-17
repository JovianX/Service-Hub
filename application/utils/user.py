import contextlib

from sqlalchemy.ext.asyncio import AsyncSession

from application.core.authentication import get_user_db
from application.core.authentication import get_user_manager
from application.models.user import User
from application.schemas.users import UserCreate


get_user_db_context = contextlib.asynccontextmanager(get_user_db)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


async def create_user(session: AsyncSession, email: str, password: str, is_superuser: bool = False):
    async with get_user_db_context(session) as user_db:
        async with get_user_manager_context(user_db) as user_manager:
            return await user_manager.create(
                UserCreate(email=email, password=password, is_superuser=is_superuser)
            )


async def delete_user(session: AsyncSession, user: User):
    async with get_user_db_context(session) as user_db:
        async with get_user_manager_context(user_db) as user_manager:
            return await user_manager.delete(user)
