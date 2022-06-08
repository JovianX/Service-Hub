from fastapi import FastAPI

from .api.api_v1.api import router as api_router

instance = FastAPI(title='Service Hub')


instance.include_router(api_router, prefix='/api/v1')
