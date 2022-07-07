"""
Different Kubernetes utilities.
"""
import re
from copy import deepcopy
from tempfile import _TemporaryFileWrapper
from typing import Dict
from typing import List

import yaml
from kubernetes.config.kube_config import ENV_KUBECONFIG_PATH_SEPARATOR
from kubernetes.config.kube_config import KubeConfigMerger

from application.constants.common import CloudProviders
from application.schemas.kubernetes import KubernetesConfigurationSchema
from application.utils.temporary_file import yaml_temporary_file


class KubernetesConfiguration:
    """
    Helper class for manipulating configuration of Kubernetes clusters and
    credentials.

    Can be used as context manager that allows to save organization Kubernetes
    configuration into file and after use deletes it.
    """
    configuration: dict
    metadata: dict
    file: _TemporaryFileWrapper = None

    def __init__(self, configuration: dict | None = None, metadata: dict | None = None):
        self.configuration = deepcopy(configuration) if configuration else {}
        self.metadata = deepcopy(metadata) if metadata else {}

    def __enter__(self):
        self.file = yaml_temporary_file()
        yaml.dump(
            KubernetesConfigurationSchema.parse_obj(self.configuration).dict(by_alias=True),
            self.file,
            default_flow_style=False
        )

        return self.file.name

    def __exit__(self, type, value, traceback):
        self.file.close()

    @property
    def clusters(self) -> Dict[str, dict]:
        """
        Returns clusters data in form of dictionary.
        """
        if not self.configuration:
            return {}

        return {cluster['name']: cluster['cluster'] for cluster in self.configuration['clusters']}

    @property
    def contexts(self) -> Dict[str, dict]:
        """
        Returns contexts data in form of dictionary.
        """
        if not self.configuration:
            return {}

        return {cluster['name']: cluster['context'] for cluster in self.configuration['contexts']}

    @property
    def users(self) -> Dict[str, dict]:
        """
        Returns users data in form of dictionary.
        """
        if not self.configuration:
            return {}

        return {cluster['name']: cluster['user'] for cluster in self.configuration['users']}

    @property
    def context_names(self) -> List[str]:
        """
        List of context names.
        """
        if not self.configuration:
            return []

        return [context['name'] for context in self.configuration['contexts']]

    def update(self, incoming_configuration: dict) -> dict:
        """
        Updates existing configuration.
        """
        if not self.configuration:
            # No configuration was set previously, nothing to merge with.
            configuration = incoming_configuration
        else:
            configuration = self._merge(self.configuration, incoming_configuration)

        self.configuration = configuration
        self.metadata['contexts'] = {}
        for context_name in self.contexts:
            if self._is_aws(context_name):
                cloud_provider = CloudProviders.aws
                region = self._get_aws_region(context_name)
            elif self._is_azure(context_name):
                cloud_provider = CloudProviders.azure
                region = None
            elif self._is_gcp(context_name):
                cloud_provider = CloudProviders.gcp
                region = self._get_gcp_region(context_name)
            else:
                cloud_provider = CloudProviders.unrecognized
                region = None
            self.metadata['contexts'][context_name] = {
                'cloud_provider': cloud_provider,
                'region': region
            }

    def _merge(self, existing_configuration: dict, incoming_configuration: dict) -> dict:
        """
        Merges existing(if present) and incoming configurations.
        """
        # kubectl and merger from Python Kubernetes client works with files only.
        with yaml_temporary_file() as current_conf_file:
            with yaml_temporary_file() as incoming_conf_file:
                yaml.safe_dump(existing_configuration, current_conf_file)
                yaml.safe_dump(incoming_configuration, incoming_conf_file)
                files_to_merge = ENV_KUBECONFIG_PATH_SEPARATOR.join([incoming_conf_file.name, current_conf_file.name])
                merger = KubeConfigMerger(files_to_merge)
                merged_configuration = merger.config_merged.value
                for node_name in ('clusters', 'contexts', 'users'):
                    merged_configuration[node_name] = [item.value for item in merged_configuration[node_name]]

        return merged_configuration

    def _is_aws(self, context_name: str) -> bool:
        """
        Returns true if context's cluster belongs to AWS cloud provider.
        """
        context = self.contexts[context_name]
        cluster_name = context['cluster']
        cluster = self.clusters[cluster_name]
        server = cluster['server']
        return server.endswith('.amazonaws.com')

    def _is_azure(self, context_name: str) -> bool:
        """
        Returns true if context's cluster belongs to MS Azure cloud provider.
        """
        return False

    def _is_gcp(self, context_name: str) -> bool:
        """
        Returns true if context's cluster belongs to Google cloud provider.
        """
        context = self.contexts[context_name]
        cluster_name: str = context['cluster']
        # Trying to determine that this is GCP by cluster name generated during
        # configuration creation. If cluster name was changed manually this
        # check will fail.
        # Pattern: {cloud provider}_{gcp project name}_{region}_{cluster name}
        splitted_cluster_name = cluster_name.split('_')
        if len(splitted_cluster_name) != 4:
            return False

        return splitted_cluster_name[0] in ('gke', 'gcp')

    def _get_aws_region(self, context_name: str) -> str | None:
        """
        Returns region from context's cluster configuration.
        """
        context = self.contexts[context_name]
        cluster_name = context['cluster']
        cluster = self.clusters[cluster_name]
        server = cluster['server']
        match = re.search(r'[a-z-]+-[1-9]+', server)
        if match:
            return match.group()

        return

    def _get_azure_region(self, context_name: str) -> str | None:
        """
        Returns region from context's cluster configuration.
        """
        raise NotImplementedError()

    def _get_gcp_region(self, context_name: str) -> str | None:
        """
        Returns region from context's cluster configuration.
        """
        context = self.contexts[context_name]
        cluster_name: str = context['cluster']
        # Trying to extract region from cluster name generated during
        # configuration creation. If cluster name was changed manually this
        # check will fail.
        # Pattern: {cloud provider}_{gcp project name}_{region}_{cluster name}
        match = re.search(r'[a-z-]+[1-9]+-[a-z]+', cluster_name)
        if match:
            return match.group()

        return
