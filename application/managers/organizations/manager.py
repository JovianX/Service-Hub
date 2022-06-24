"""
Classes that include business logic of Organizations.
"""
import tempfile
from typing import Any

import yaml
from faker import Faker
from fastapi import Depends
from kubernetes.config.kube_config import ENV_KUBECONFIG_PATH_SEPARATOR
from kubernetes.config.kube_config import KubeConfigMerger

from application.core.configuration import settings
from application.crud.organizations import OrganizationDatabase
from application.db.session import get_session
from application.managers.kubernetes import K8sManager
from application.models.organization import Organization
from application.utils.kubernetes import KubernetesConfigurationFile

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

    async def merge_kubernetes_configurations(self, current_configuration: dict, incoming_configuration: dict) -> dict:
        """
        Merges existing(if present) and incoming configurations.
        """
        if not current_configuration:
            # No configuration was set previously, nothing to merge with.
            return current_configuration

        # kubectl and merger from Python Kubernetes client works with files only.
        temp_file_params = {
            'mode': 'w',
            'suffix': '.yaml',
            'dir': settings.FILE_STORAGE_ROOT
        }
        with tempfile.NamedTemporaryFile(**temp_file_params) as current_conf_file:
            with tempfile.NamedTemporaryFile(**temp_file_params) as incoming_conf_file:
                yaml.safe_dump(current_configuration, current_conf_file)
                yaml.safe_dump(incoming_configuration, incoming_conf_file)
                merger = KubeConfigMerger(
                    ENV_KUBECONFIG_PATH_SEPARATOR.join([incoming_conf_file.name, current_conf_file.name])
                )
                merged_configuration = merger.config_merged.value
                for node_name in ('clusters', 'contexts', 'users'):
                    merged_configuration[node_name] = [item.value for item in merged_configuration[node_name]]

        return merged_configuration

    async def update_kubernetes_configuration(self, instance: Organization, configuration: dict):
        """
        Saves new of does merge with existing Kubernetes configuration.
        """
        SettingsSchema.parse_obj({'kubernetes_configuration': configuration})
        current_settings = instance.settings
        if 'kubernetes_configuration' in current_settings:
            configuration = await self.merge_kubernetes_configurations(
                current_settings['kubernetes_configuration'], configuration
            )
        await self.update_setting(instance, 'kubernetes_configuration', configuration)

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

    def get_kubernetes_configuration(self, instance: Organization) -> KubernetesConfigurationFile:
        setting = self.get_setting(instance, 'kubernetes_configuration')

        return KubernetesConfigurationFile(setting.dict(exclude_unset=True))


async def get_organization_db(session=Depends(get_session)):
    yield OrganizationDatabase(session)


async def get_organization_manager(organization_db=Depends(get_organization_db)):
    yield OrganizationManager(organization_db)
