"""
Different Kubernetes utilities.
"""
import tempfile

import yaml

from application.managers.organizations.settings_schemas import KubernetesConfigurationSchema


class KubernetesConfigurationFile:
    """
    Context manager that allows to save organization Kubernetes configuration
    into file and after use deletes it.
    """
    configuration: KubernetesConfigurationSchema
    file = None

    def __init__(self, configuration: KubernetesConfigurationSchema):
        self.configuration = configuration

    def __enter__(self):
        self.file = tempfile.NamedTemporaryFile(mode='w', suffix='.yaml')
        yaml.dump(self.configuration, self.file, default_flow_style=False)

        return self.file.name

    def __exit__(self, type, value, traceback):
        self.file.close()
