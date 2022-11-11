from collections import Counter

from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.v1.api import router as api_router
from exceptions.common import CommonException
from services.procrastinate.application import procrastinate


try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

instance = FastAPI(title='Service Hub')

instance.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

instance.include_router(api_router, prefix='/api/v1')


@instance.exception_handler(CommonException)
def db_validation_handler(request: Request, error: CommonException) -> JSONResponse:
    return JSONResponse(status_code=error.status_code, content={'message': error.message})


@instance.on_event('startup')
async def routes_uniqueness_check():
    """
    Checks that all API endpoints have unique names.
    """
    duplicating_routes = [
        route for route, count in Counter([route.name for route in instance.routes]).items() if count > 1
    ]
    if duplicating_routes:
        raise ValueError(f'Application have duplicate route names: {" ".join(duplicating_routes)}')


@instance.on_event('startup')
async def start_procrastinate_application():
    """
    Starts procrastinate applicaton.
    """
    await procrastinate.open_async()


@instance.on_event('shutdown')
async def stop_procrastinate_application():
    """
    Stops procrastinate applicaton.
    """
    await procrastinate.close_async()
