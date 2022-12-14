"""
Templates bussines logic.
"""
import logging
import tempfile
from pathlib import Path

import yaml
from fastapi import Depends
from fastapi import status

from core.configuration import settings
from crud.templates import TemplateDatabase
from crud.templates import get_template_db
from exceptions.common import CommonException
from exceptions.shell import NonZeroStatusException
from models.organization import Organization
from models.template import TemplateRevision
from models.user import User
from schemas.templates import TemplateSchema
from utils.shell import run
from utils.template import load_template
from utils.template import render_template


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
        template: str,
        description: str | None = None,
        enabled: bool | None = None,
    ) -> TemplateRevision:
        """
        Creates template new template revision.
        """
        if description is None:
            description = ''
        if enabled is None:
            enabled = False
        revision_number = 1

        parsed_template = load_template(template)
        organization_templates = await self.list_templates(creator.organization)
        default = len(organization_templates) < 1  # First organization template or not.
        last_revision = await self.get_last_revision(creator.organization, parsed_template.name)
        if last_revision:
            # Revision of existing template.
            if last_revision.template == template:
                raise CommonException(
                    'Uploaded template is identical with last uploaded.',
                    status_code=status.HTTP_409_CONFLICT
                )
            revision_number += last_revision.revision

        template_data = {
            'name': parsed_template.name,
            'description': description,
            'revision': revision_number,
            'template': template,
            'enabled': enabled,
            'default': default,
            'creator_id': str(creator.id),
            'organization_id': creator.organization.id
        }
        template_revision = await self.db.create(template_data)

        return template_revision

    async def get_last_revision(self, organization: Organization, name: str):
        """
        Gets template record.
        """
        return await self.db.get_last_revision(organization_id=organization.id, name=name)

    async def get_organization_template(self, template_id: int, organization: Organization) -> TemplateRevision:
        """
        Returns template that belongs to organization.
        """
        return await self.db.get(id=template_id, organization_id=organization.id)

    async def list_templates(self, organization: Organization) -> list[TemplateRevision]:
        """
        Returns list of templates that belongs to organization.
        """
        return await self.db.list(organization_id=organization.id)

    async def make_template_default(self, template_id: int, organization: Organization) -> TemplateRevision:
        """
        Makes template default.
        """
        template: TemplateRevision = await self.db.get(id=template_id, organization_id=organization.id)
        if not template.enabled:
            raise CommonException(
                f'Disabled template can not be set as default.',
                status_code=status.HTTP_403_FORBIDDEN
            )
        return await self.db.make_default(template_id, organization.id)

    async def update_template(
        self,
        template_id: int,
        organization: Organization,
        template_data: dict
    ) -> TemplateRevision:
        """
        Updates template instance.
        """
        if 'enabled' in template_data:
            template: TemplateRevision = await self.db.get(id=template_id, organization_id=organization.id)
            if template.default and not template_data['enabled']:
                raise CommonException(
                    f'Default template can not be disabled.',
                    status_code=status.HTTP_403_FORBIDDEN
                )
        await self.db.update(template_data, id=template_id, organization_id=organization.id)
        return await self.db.get(id=template_id, organization_id=organization.id)

    async def delete_template(self, template_id: int, organization: Organization):
        """
        Deletes template that belongs to organization.
        """
        template: TemplateRevision = await self.db.get(id=template_id, organization_id=organization.id)
        if template.default:
            raise CommonException(
                f'Default template can not be deleted.',
                status_code=status.HTTP_403_FORBIDDEN
            )
        await self.db.delete(id=template_id, organization_id=organization.id)

    async def _extract_template(self, archive: bytes) -> dict:
        """
        Extracts template from template archive.

        NOTE: This method is for future when template will be upload as archive
              with tempalte and charts. Currently it is uploaded as raw YAML.
        """
        template_file_name = 'template.yaml'

        # Dump archive into temporary directory.
        with tempfile.TemporaryDirectory(dir=settings.FILE_STORAGE_ROOT) as directory:
            archive_path = Path(directory.name) / 'archive.tar.gz'
            extracted_archive_directory = Path(directory.name) / 'extracted'
            template_path = extracted_archive_directory / template_file_name

            with open(archive_path, 'wb') as archive_file:
                archive_file.write(archive)

            # Extracting template.
            try:
                await run(f'tar --extract --gzip --directory={extracted_archive_directory} --file={archive_path}')
            except NonZeroStatusException as error:
                logger.exception(f'Failed to extract archive. Error: {error.stderr_message}')
                raise CommonException(f'Template archive is invalid.', status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

            # Looking for template and parsing it.
            if not template_path.is_file():
                raise CommonException(
                    f'Template archive does not contains template.',
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            with open(template_path) as template_file:
                template = yaml.safe_load(template_file)

        return template


async def get_template_manager(db=Depends(get_template_db)):
    yield TemplateManager(db)
