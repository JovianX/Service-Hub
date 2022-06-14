from typing import AsyncGenerator
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from application.core.configuration import settings
from application.db.session import get_session_maker, get_session
from application.instance import instance


async def get_test_session() -> AsyncGenerator[AsyncSession, None]:
    async with get_session_maker(settings.TEST_DATABASE_URL)() as session:
        yield session


@pytest.fixture(scope='session')
async def db() -> AsyncGenerator[AsyncSession, None]:
    async with get_session_maker(settings.TEST_DATABASE_URL)() as session:
        yield session


instance.dependency_overrides[get_session] = get_test_session


@pytest.fixture(scope='module')
def client() -> Generator:
    with TestClient(instance) as client:
        yield client
