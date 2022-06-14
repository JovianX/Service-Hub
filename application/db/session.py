from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

from ..core.configuration import settings


# engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)
# session_maker = sessionmaker(engine, class_=AsyncSession, autocommit=False, autoflush=False)


def get_session_maker(database_url: str):
    engine = create_async_engine(database_url, pool_pre_ping=True)
    return sessionmaker(engine, class_=AsyncSession, autocommit=False, autoflush=False)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with get_session_maker(settings.DATABASE_URL)() as session:
        yield session
