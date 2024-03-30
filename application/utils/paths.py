"""
Project paths.
"""
from pathlib import Path

from core.configuration import settings
from models.organization import Organization


def organization_home(organization: Organization) -> Path:
    """
    Organization home directory.
    """
    return Path(settings.FILE_STORAGE_ROOT) / str(organization.id)
