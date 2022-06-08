from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

from ..core.configuration import settings

engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)
session_maker = sessionmaker(engine, class_=AsyncSession, autocommit=False, autoflush=False)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with session_maker() as session:
        yield session
