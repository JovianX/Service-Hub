from pydantic import BaseSettings
from pydantic import DirectoryPath
from pydantic import FilePath
from pydantic import PostgresDsn


class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn
    TEST_DATABASE_URL: PostgresDsn

    SECRET: str = 'SUW2kc5vw4XXASRmdefbUVWLQ0dRq8ylEdetifdKgzU'

    # Path to Helm executable.
    HELM_EXECUTABLE: str = 'helm'
    KUBECTL_EXECUTABLE: str = 'kubectl'

    # OAuth authentication
    GOOGLE_CLIENT_ID: str = ''
    GOOGLE_CLIENT_SECRET: str = ''

    # Path to directory where stored all project's files.
    FILE_STORAGE_ROOT: DirectoryPath

    class Config:
        env_file = '.env'


settings = Settings()
