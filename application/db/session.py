from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

from ..core.configuration import settings


def get_engine(database_url: str) -> AsyncEngine:
    return create_async_engine(database_url, pool_pre_ping=True)


def get_session_maker(engine: str):
    return sessionmaker(engine, class_=AsyncSession, autocommit=False, autoflush=False, expire_on_commit=False)


engine = get_engine(settings.DATABASE_URL)
session_maker = get_session_maker(engine)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with session_maker() as session:
        yield session
