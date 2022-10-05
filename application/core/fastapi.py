from typing import Callable

from fastapi.routing import APIRoute
from fastapi.routing import APIRouter


class RoleAPIRoute(APIRoute):
    """
    Route that keeps user roles with which allow usage of this endpoint.
    """
    roles: list[str] = None

    def __init__(self, *args, roles: list[str] | None = None, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.roles = roles

    @property
    def roles(self) -> list[str]:
        """
        Route user's roles with which allowed access to current route.
        """
        return getattr(self.endpoint, 'roles', [])

    @roles.setter
    def roles(self, roles: list[str]):
        """
        We setting it to handler because route is recreated each time when
        `include_router` is being called. And handler only thing is keeping
        untouched.
        """
        if roles is not None:
            self.endpoint.roles = roles


class RoleAPIRouter(APIRouter):
    """
    Extends standart FastAPI router to allow storing of route roles.
    """
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault('route_class', RoleAPIRoute)
        super().__init__(*args, **kwargs)

    def add_api_route(self, path: str, endpoint: Callable, roles: list[str] | None = None, **kwargs) -> None:
        super().add_api_route(path, endpoint, **kwargs)
        self.routes[-1].roles = roles

    def api_route(self, path: str, roles: list[str] | None = None, **kwargs):
        def decorator(func):
            self.add_api_route(path, func, roles=roles, **kwargs)
            return func

        return decorator

    def get(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['GET'], roles=roles)

    def put(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['PUT'], roles=roles)

    def post(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['POST'], roles=roles)

    def delete(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['DELETE'], roles=roles)

    def options(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['OPTIONS'], roles=roles)

    def head(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['HEAD'], roles=roles)

    def patch(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['PATCH'], roles=roles)

    def trace(self, *args, roles: list[str] | None = None, **kwargs):
        return self.api_route(*args, **kwargs, methods=['TRACE'], roles=roles)
