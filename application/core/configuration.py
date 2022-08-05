from pathlib import Path

from pydantic import BaseSettings
from pydantic import DirectoryPath
from pydantic import PostgresDsn


class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn
    TEST_DATABASE_URL: PostgresDsn

    SECRET: str = 'SUW2kc5vw4XXASRmdefbUVWLQ0dRq8ylEdetifdKgzU'

    # Helm settings.
    HELM_EXECUTABLE: str = 'helm'
    HELM_HOME_ARCHIVE_SIZE_LIMIT: int | float = 300 * 1024  # 300KiB in bytes
    HELM_PLUGINS_DIRECTORY: DirectoryPath = Path.home()/'.local'/'share'/'helm'/'plugins'

    # Kubernetes settings.
    KUBECTL_EXECUTABLE: str = 'kubectl'

    # OAuth authentication
    GOOGLE_CLIENT_ID: str = ''
    GOOGLE_CLIENT_SECRET: str = ''
    GITHUB_CLIENT_ID: str = ''
    GITHUB_CLIENT_SECRET: str = ''

    # Path to directory where stored all project's files.
    FILE_STORAGE_ROOT: DirectoryPath

    class Config:
        env_file = '.env'
        secrets_dir = 'credentials'
        case_sensitive = True


settings = Settings()
