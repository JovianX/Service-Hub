from procrastinate import AiopgConnector
from procrastinate import App

from core.configuration import settings


procrastinate = App(
    connector=AiopgConnector(
        user=settings.DATABASE_URL.user,
        password=settings.DATABASE_URL.password,
        host=settings.DATABASE_URL.host,
        port=settings.DATABASE_URL.port,
        database=settings.DATABASE_URL.path.strip('/')
    ),
    import_paths=['services.procrastinate.tasks.application']
)
procrastinate.open()
