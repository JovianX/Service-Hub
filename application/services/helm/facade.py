from .subcommands.get import HelmGet
from .subcommands.list import HelmList
from .subcommands.repositories import HelmRepository
from .subcommands.search import HelmSearch


class HelmService:
    """
    Class that contains all helm commands.
    """

    def __init__(self, kubernetes_configuration: str, helm_home: str) -> None:
        """
        Parameters:
        kubernetes_configuration - path to Kubernetes configuration file.
        helm_home - path to directory where stored Helm data.
        """
        self.get: HelmGet = HelmGet(kubernetes_configuration, helm_home)
        self.list: HelmList = HelmList(kubernetes_configuration, helm_home)
        self.repository: HelmRepository = HelmRepository(kubernetes_configuration, helm_home)
        self.search: HelmSearch = HelmSearch(kubernetes_configuration, helm_home)
