"""
Different Kubernetes utilities.
"""
import tempfile
from typing import List

import yaml
from kubernetes.config.kube_config import ENV_KUBECONFIG_PATH_SEPARATOR
from kubernetes.config.kube_config import KubeConfigMerger

from application.core.configuration import settings
from application.utils.temporary_file import yaml_temporary_file


class KubernetesConfiguration:
    """
    Helper class for manipulating configuration of Kubernetes clusters and
    credentials.

    Can be used as context manager that allows to save organization Kubernetes
    configuration into file and after use deletes it.
    """
    configuration: dict
    file = None

    def __init__(self, configuration: dict):
        self.configuration = configuration

    def __enter__(self):
        self.file = yaml_temporary_file()
        yaml.dump(self.configuration, self.file, default_flow_style=False)

        return self.file.name

    def __exit__(self, type, value, traceback):
        self.file.close()

    @property
    def contexts(self) -> List[str]:
        """
        List of context names.
        """
        return [context['name'] for context in self.configuration['contexts']]

    def merge(self, incoming_configuration: dict) -> dict:
        """
        Merges existing(if present) and incoming configurations.
        """
        if not self.configuration:
            # No configuration was set previously, nothing to merge with.
            return incoming_configuration

        # kubectl and merger from Python Kubernetes client works with files only.
        with yaml_temporary_file() as current_conf_file:
            with yaml_temporary_file() as incoming_conf_file:
                yaml.safe_dump(self.configuration, current_conf_file)
                yaml.safe_dump(incoming_configuration, incoming_conf_file)
                files_to_merge = ENV_KUBECONFIG_PATH_SEPARATOR.join([incoming_conf_file.name, current_conf_file.name])
                merger = KubeConfigMerger(files_to_merge)
                merged_configuration = merger.config_merged.value
                for node_name in ('clusters', 'contexts', 'users'):
                    merged_configuration[node_name] = [item.value for item in merged_configuration[node_name]]

        self.configuration = merged_configuration

        return self.configuration
