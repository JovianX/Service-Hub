"""
Different helm utilities.
"""
from pathlib import Path

from application.core.configuration import settings
from application.managers.organizations.manager import OrganizationManager
from application.models.organization import Organization
from application.utils.shell import run


class HelmArchive:
    """
    Context manager to extract Helm home directory and compress after usage.
    """

    def __init__(self, organization: Organization, organization_manager: OrganizationManager):
        self.organization = organization
        self.organization_manager = organization_manager
        self.archive = organization.helm_home

        organization_directory = Path(settings.FILE_STORAGE_ROOT) / str(organization.id)
        self.helm_home = organization_directory / 'helm'
        self.helm_home_archive = organization_directory / 'archive.tar.gz'

    async def __aenter__(self):
        if self.archive:
            self.helm_home.mkdir(parents=True, exist_ok=True)
            with open(self.helm_home_archive, mode='wb') as file:
                file.write(self.archive)
            await run(f'tar --extract --gzip --directory={self.helm_home} --file={self.helm_home_archive}')

        return self.helm_home

    async def __aexit__(self, type, value, traceback):
        """
        Creating archive of Helm home directory with excluded cache and saving
        it into organization database record.
        """
        if self.helm_home.exists():
            await run(f'tar --gzip --create --directory={self.helm_home} --exclude=cache --file={self.helm_home_archive} .')
            with open(self.helm_home_archive, mode='rb') as file:
                self.organization.helm_home = file.read()
            await self.organization_manager.db.save(self.organization)
