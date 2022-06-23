import asyncio
from urllib.parse import urlparse

import asyncpg
import pytest_asyncio
from httpx import AsyncClient

from application.core.authentication import current_active_user
from application.core.configuration import settings
from application.db.base_class import Base
from application.db.session import get_engine
from application.db.session import get_session
from application.db.session import get_session_maker
from application.instance import instance
from application.utils.user import create_user
from application.utils.user import delete_user

from .fixtures.cluster_configuration import cluster_configuration


engine = get_engine(settings.TEST_DATABASE_URL)
session_maker = get_session_maker(engine)


async def create_database():
    """
    Create database if it doesn't exists.
    """
    database_credentials = urlparse(str(engine.url))

    user = database_credentials.username
    password = database_credentials.password
    database = database_credentials.path.strip('/')

    try:
        connection = await asyncpg.connect(user=user, password=password, database=database)
        await connection.close()
    except asyncpg.InvalidCatalogNameError:
        # Database does not exist, create it.
        connection = await asyncpg.connect(user=user, password=password, database='template1')
        await connection.execute(f'CREATE DATABASE "{database}" OWNER "{user}"')
        await connection.close()


# @pytest_asyncio.fixture
async def init_db():
    """
    Set up the database once.
    """
    await create_database()
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    await engine.dispose()
asyncio.run(init_db())


# This fixture is the main difference to before. It creates a nested
# transaction, recreates it when the application code calls session.commit
# and rolls it back at the end.
@pytest_asyncio.fixture
async def session():
    async with engine.connect() as connection:
        async with connection.begin() as transaction:
            async with session_maker(bind=connection) as session:
                yield session

                # Rolling back changes, restoring the state before the test ran.
                await transaction.rollback()
    await engine.dispose()


# A fixture for the fastapi test client which depends on the
# previous session fixture. Instead of creating a new session in the
# dependency override as before, it uses the one provided by the
# session fixture.
@pytest_asyncio.fixture
async def client(session):
    async def get_test_db_session():
        yield session

    instance.dependency_overrides[get_session] = get_test_db_session
    async with AsyncClient(
            app=instance,
            base_url='http://localhost:8000/api/v1',
            headers={'Content-Type': 'application/json'}) as client:
        yield client
    del instance.dependency_overrides[get_session]


@pytest_asyncio.fixture
async def current_user(session):
    user = await create_user(session, 'user@mail.com', '123123')

    async def get_user():
        yield user

    instance.dependency_overrides[current_active_user] = get_user
    yield user
    del instance.dependency_overrides[current_active_user]
    await delete_user(session, user)
