import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.user import User


@pytest.mark.asyncio
async def test_user_register(client: AsyncClient, session: AsyncSession) -> None:
    email = 'user@mail.com'
    password = '123123'
    data = {
        'email': email,
        'password': password
    }
    response = await client.post('/auth/register', json=data)
    assert 200 <= response.status_code < 300
    created_user = response.json()
    result = await session.execute(
        select(User).options(selectinload(User.oauth_accounts)).where(User.email == email)
    )
    db_user = result.scalars().first()
    assert created_user['email'] == db_user.email
