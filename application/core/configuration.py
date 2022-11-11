"""
Project settings.
"""

import os

from pathlib import Path
from pydantic import AnyHttpUrl
from pydantic import BaseSettings
from pydantic import DirectoryPath
from pydantic import PostgresDsn


class Settings(BaseSettings):
    # E-mail settings.
    EMAIL_SENDER: str = ''
    EMAIL_SMTP_HOST: str = ''
    EMAIL_SMTP_PORT: int | None = None
    EMAIL_SMTP_LOGIN: str = ''
    EMAIL_SMTP_PASSWORD: str = ''

    DATABASE_URL: PostgresDsn
    TEST_DATABASE_URL: PostgresDsn

    # Helm settings.
    HELM_EXECUTABLE: str = 'helm'
    HELM_HOME_ARCHIVE_SIZE_LIMIT: int | float = 300 * 1024  # 300KiB in bytes
    HELM_PLUGINS_DIRECTORY: DirectoryPath = Path.home()/'.local'/'share'/'helm'/'plugins'

    # Kubernetes settings.
    KUBECTL_EXECUTABLE: str = 'kubectl'

    # Authentication and authorization
    SECRET: str = 'SUW2kc5vw4XXASRmdefbUVWLQ0dRq8ylEdetifdKgzU'
    USER_SESSION_TTL: int = 3600  # In seconds

    # OAuth authentication
    GOOGLE_CLIENT_ID: str = ''
    GOOGLE_CLIENT_SECRET: str = ''
    GITHUB_CLIENT_ID: str = ''
    GITHUB_CLIENT_SECRET: str = ''

    # Path to directory where stored all project's files.
    FILE_STORAGE_ROOT: DirectoryPath

    # Misc
    HELM_HOME_ARCHIVE_SIZE_LIMIT: int | float = 300 * 1024  # 300KiB in bytes
    INVITATION_EMAIL_SENDING_BLOCK: int = 60  # In seconds.
    UI_HOST: AnyHttpUrl = 'http://localhost:3000'
    APPLICATION_COMPONENTS_INSTALL_TIMEOUT: int = 3600  # One hour in seconds.
    INITIAL_ORGANIZATION_TEMPLATE: str | None = None
    INITIAL_ORGANIZATION_REPOSITORY_URL: str | None = 'https://charts.bitnami.com/bitnami'

    class Config:
        env_file = os.environ.get('ENV_FILE', '.env')
        secrets_dir = os.environ.get('SECRETS_DIRECTORY', 'credentials')
        case_sensitive = True


settings = Settings()
