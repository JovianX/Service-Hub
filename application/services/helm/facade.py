from .subcommands.dependency import HelmDependency
from .subcommands.get import HelmGet
from .subcommands.history import HelmHistory
from .subcommands.install import HelmInstall
from .subcommands.list import HelmList
from .subcommands.release import HelmRelease
from .subcommands.repositories import HelmRepository
from .subcommands.search import HelmSearch
from .subcommands.show import HelmShow
from .subcommands.uninstall import HelmUninstall
from .subcommands.upgrade import HelmUpgrade


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
        self.dependency: HelmDependency = HelmDependency(kubernetes_configuration, helm_home)
        self.get: HelmGet = HelmGet(kubernetes_configuration, helm_home)
        self.history: HelmHistory = HelmHistory(kubernetes_configuration, helm_home)
        self.install: HelmInstall = HelmInstall(kubernetes_configuration, helm_home)
        self.list: HelmList = HelmList(kubernetes_configuration, helm_home)
        self.release: HelmRelease = HelmRelease(kubernetes_configuration, helm_home)
        self.repository: HelmRepository = HelmRepository(kubernetes_configuration, helm_home)
        self.search: HelmSearch = HelmSearch(kubernetes_configuration, helm_home)
        self.show: HelmShow = HelmShow(kubernetes_configuration, helm_home)
        self.uninstall: HelmUninstall = HelmUninstall(kubernetes_configuration, helm_home)
        self.upgrade: HelmUpgrade = HelmUpgrade(kubernetes_configuration, helm_home)
