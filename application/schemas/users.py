import uuid

from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    pass


class UserCreate(schemas.BaseUserCreate):
    organization_id: int | None


class UserUpdate(schemas.BaseUserUpdate):
    pass
