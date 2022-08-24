"""
Project paths.
"""
from pathlib import Path

from models.organization import Organization
from core.configuration import settings


def organization_home(organization: Organization) -> Path:
    """
    Organization home directory.
    """
    return Path(settings.FILE_STORAGE_ROOT) / str(organization.id)
