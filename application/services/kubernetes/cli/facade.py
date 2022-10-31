from .subcommands.cluster_info import KubectlClusterInformation
from .subcommands.configuration import KubectlConfig
from .subcommands.logs import KubectlLogs


class KubectlCLI:
    """
    Class that contains all kubectl commands.
    """

    def __init__(self, kubernetes_configuration: str) -> None:
        """
        Parameters:
        kubernetes_configuration - path to Kubernetes configuration file.
        """
        self.cluster_information: KubectlClusterInformation = KubectlClusterInformation(kubernetes_configuration)
        self.configuration: KubectlConfig = KubectlConfig(kubernetes_configuration)
        self.logs: KubectlLogs = KubectlLogs(kubernetes_configuration)
