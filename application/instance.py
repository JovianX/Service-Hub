from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1.api import router as api_router


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
