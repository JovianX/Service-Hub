from pydantic import BaseSettings
from pathlib import Path

SERVICE_HUB_SETTINGS_HOME = Path.home() / '.service_hub'
SERVICE_HUB_SETTINGS_FILE = SERVICE_HUB_SETTINGS_HOME / 'settings.ini'


class Settings(BaseSettings):
    access_token: str = ''
    api_host: str = 'https://api.hub.jovianx.app/'

    class Config:
        env_file = SERVICE_HUB_SETTINGS_FILE
        case_sensitive = True


settings = Settings()
