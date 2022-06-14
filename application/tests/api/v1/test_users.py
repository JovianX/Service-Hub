from urllib import response
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from httpx import AsyncClient
from application.instance import instance


@pytest.mark.asyncio
async def test_user_register(db: AsyncSession) -> None:
    data = {
        'email': 'user@mail.com',
        'password': '123123'
    }
    async with AsyncClient(app=instance, base_url='http://localhost:8000') as client:
        response = await client.post('/api/v1/auth/register', json=data)
    assert 200 <= response.status_code < 300
    created_user = response.json()
