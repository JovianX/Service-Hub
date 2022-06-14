from fastapi import FastAPI

from .api.v1.api import router as api_router


try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

instance = FastAPI(title='Service Hub')


instance.include_router(api_router, prefix='/api/v1')
