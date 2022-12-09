from asyncio import current_task
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import async_scoped_session
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

from core.configuration import settings


def get_engine(database_url: str = settings.DATABASE_URL) -> AsyncEngine:
    return create_async_engine(database_url, pool_pre_ping=True)


def get_session_maker(engine: str):
    return sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


engine = get_engine()
session_maker = async_scoped_session(get_session_maker(engine), scopefunc=current_task)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with session_maker() as session:
        yield session
