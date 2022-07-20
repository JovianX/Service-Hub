"""
Templates bussines logic.
"""
import logging
import tempfile
from pathlib import Path

import yaml
from fastapi import Depends
from fastapi import status
from pydantic import ValidationError
from pydantic.error_wrappers import display_errors

from application.core.configuration import settings
from application.crud.templates import TemplateDatabase
from application.crud.templates import get_template_db
from application.exceptions.common import CommonException
from application.exceptions.shell import NonZeroStatusException
from application.exceptions.templates import InvalidTemplateException
from application.models.organization import Organization
from application.models.template import Template
from application.models.user import User
from application.utils.shell import run

from .schemas.manifest import TemplateManifestSchema


logger = logging.getLogger(__name__)


class TemplateManager:
    """
    Template managment logic.
    """

    def __init__(self, db: TemplateDatabase) -> None:
        self.db = db

    async def create_template(
        self,
        creator: User,
        raw_manifest: str,
        description: str | None = None,
        enabled: bool | None = None,
    ) -> Template:
        """
        Creates instanse of template.
        """
        if description is None:
            description = ''
        if enabled is None:
            enabled = False

        manifest = self.load_manifest(raw_manifest)

        template = {
            'name': name,
            'description': description,
            'enabled': enabled,
            'creator_id': creator.id,
            'organization_id': creator.organization.id
        }

        return await self.db.create(template)

    async def list_templates(self, organization: Organization) -> list[Template]:
        """
        Returns list of templates that belongs to organization.
        """
        return await self.db.list(organization_id=organization.id)

    async def make_template_default(self, template_id: int, organization: Organization) -> Template:
        """
        Makes template default.
        """
        return await self.db.make_default(template_id, organization.id)

    async def update_template(self, template_id: int, organization: Organization, template_data: dict) -> Template:
        """
        Updates template instance.
        """
        await self.db.update(template_data, id=template_id, organization_id=organization.id)
        return await self.db.get(id=template_id, organization_id=organization.id)

    async def delete_template(self, template_id: int, organization: Organization):
        """
        Deletes template that belongs to organization.
        """
        await self.db.delete(id=template_id, organization_id=organization.id)

    async def _extract_manifest(self, archive: bytes) -> dict:
        """
        Extracts manifest from template archive.

        NOTE: This method is for future when template will be upload as archive
              with manifest and charts. Currently it is uploaded as raw YAML.
        """
        manifest_file_name = 'manifest.yaml'

        # Dump archive into temporary directory.
        with tempfile.TemporaryDirectory(dir=settings.FILE_STORAGE_ROOT) as directory:
            archive_path = Path(directory.name) / 'archive.tar.gz'
            extracted_archive_directory = Path(directory.name) / 'extracted'
            manifest_path = extracted_archive_directory / manifest_file_name

            with open(archive_path, 'wb') as archive_file:
                archive_file.write(archive)

            # Extracting template.
            try:
                await run(f'tar --extract --gzip --directory={extracted_archive_directory} --file={archive_path}')
            except NonZeroStatusException as error:
                logger.exception(f'Failed to extract archive. Error: {error.stderr_message}')
                raise CommonException(f'Template archive is invalid.', status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

            # Looking for manifest and parsing it.
            if not manifest_path.is_file():
                raise CommonException(
                    f'Template archive does not contains manifest.',
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            with open(manifest_path) as manifest_file:
                manifest = yaml.safe_load(manifest_file)

        return manifest

    def validate_manifest(self, manifest: dict) -> None:
        """
        Validates manifest.
        """
        try:
            TemplateManifestSchema.parse_obj(manifest)
        except ValidationError as error:
            raise InvalidTemplateException(f'Template manifest is invalid.\n{display_errors(error.errors())}')

    def load_manifest(self, raw_manifest: str) -> TemplateManifestSchema:
        """
        Parses raw manifest YAML and validates it.
        """
        parsed_manifest_data = yaml.safe_load(raw_manifest)

        return self.validate_manifest(parsed_manifest_data)


async def get_template_manager(db=Depends(get_template_db)):
    yield TemplateManager(db)
