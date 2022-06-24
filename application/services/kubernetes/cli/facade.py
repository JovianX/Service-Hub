from .subcommands.configuration import KubectlConfig


class KubectlCLI:
    """
    Class that contains all kubectl commands.
    """

    def __init__(self, kubernetes_configuration: str) -> None:
        """
        Parameters:
        kubernetes_configuration - path to Kubernetes configuration file.
        """
        self.configuration: KubectlConfig = KubectlConfig(kubernetes_configuration)
