"""
Classes that include business logic of Organizations.
"""
from typing import Any

import yaml
from faker import Faker
from fastapi import Depends
from fastapi import status

from application.crud.organizations import OrganizationDatabase
from application.crud.organizations import get_organization_db
from application.exceptions.common import CommonException
from application.managers.kubernetes import K8sManager
from application.models.organization import Organization
from application.utils.kubernetes import KubernetesConfiguration

from .settings_schemas import ROOT_SETTING_SCHEMAS
from .settings_schemas import SettingsSchema


class OrganizationManager:
    """
    Organization management logic.
    """
    db: OrganizationDatabase

    def __init__(self, db: OrganizationDatabase) -> None:
        self.db = db

    async def create(self, title: str = None) -> Organization:
        """
        Initializes organization instance and saves it into database.
        """
        if not title:
            # NOTE: Temporary generating random company title until absent Organization editing.
            title = Faker().company()
        return await self.db.create({
            'title': title
        })

    async def delete_context(self, instance: Organization, context_name: str) -> None:
        """
        Delete context from Kubernetes configuration with helm of kubectl.
        """
        with self.get_kubernetes_configuration(instance) as k8s_configuration_path:
            k8s_manager = K8sManager(k8s_configuration_path)
            await k8s_manager.delete_context(context_name)
            with open(k8s_configuration_path) as k8s_configuration_file:
                configuratoin = yaml.safe_load(k8s_configuration_file)
        await self.update_setting(instance, 'kubernetes_configuration', configuratoin)

    async def update_kubernetes_configuration(self, instance: Organization, incoming_configuration: dict):
        """
        Saves new of does merge with existing Kubernetes configuration.
        """
        # Validating incoming configuration.
        SettingsSchema.parse_obj({'kubernetes_configuration': incoming_configuration})

        current_settings = instance.settings
        kubernetes_configuration = incoming_configuration
        if current_settings.get('kubernetes_configuration'):
            configuration = KubernetesConfiguration(current_settings['kubernetes_configuration'])
            kubernetes_configuration = configuration.merge(incoming_configuration)

        await self.update_setting(instance, 'kubernetes_configuration', kubernetes_configuration)

    async def update_setting(self, instance: Organization, setting_name: str, setting_value: Any):
        """
        Sets organization settings and updates organization record in database.

        In database storing only setting that was set previously. This allow us
        use recent setting defaults changed in source code.
        """
        if setting_name not in SettingsSchema.__fields__:
            raise ValueError(f'Unknown organization setting: "{setting_name}".')
        # Validating incoming setting value.
        SettingsSchema.parse_obj({setting_name: setting_value})

        # It look like SQLAlchemy badly tracking changes of JSON field. Forcing
        # it to spot field change by replacing full field value.
        instance.settings = {**instance.settings, **{setting_name: setting_value}}
        await self.db.save(instance)

    def get_setting(self, instance: Organization, setting_name: str) -> ROOT_SETTING_SCHEMAS:
        """
        Returns organization setting if it was set previosly or its default
        defined in SettingsSchema otherwise.
        """
        if setting_name not in SettingsSchema.__fields__:
            raise ValueError(f'Unknown organization setting: "{setting_name}".')
        settings = SettingsSchema.parse_obj(instance.settings)

        return getattr(settings, setting_name)

    def get_kubernetes_configuration(self, instance: Organization) -> KubernetesConfiguration:
        setting = self.get_setting(instance, 'kubernetes_configuration')
        if not setting:
            raise CommonException(
                'Organization does not have uploaded Kubernetes configuration.',
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        return KubernetesConfiguration(setting.dict(exclude_unset=True))


async def get_organization_manager(organization_db=Depends(get_organization_db)):
    yield OrganizationManager(organization_db)
