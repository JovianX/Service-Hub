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

    # OAuth authentication
    GOOGLE_CLIENT_ID: str = ''
    GOOGLE_CLIENT_SECRET: str = ''

    # Path to Kubernetes configuration file. This should temporary setting until
    # we not introduce "Organizations" and thair's settings.
    KUBERNETES_CONFIGURATION: FilePath
    # Path to directory where stored all project's files.
    FILE_STORAGE_ROOT: DirectoryPath

    class Config:
        env_file = '.env'


settings = Settings()
