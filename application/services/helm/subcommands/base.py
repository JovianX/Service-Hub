from pathlib import Path
from typing import Dict

from application.core.configuration import settings
from application.utils.shell import run


class HelmBase:
    """
    Base class for all helm commands.
    """
    configuration: str
    home_directory: str

    def __init__(self, kubernetes_configuration: str, helm_home: str) -> None:
        """
        Parameters:
        kubernetes_configuration - path to Kubernetes configuration file.
        helm_home - path to directory where stored Helm data.
        """
        self.configuration = kubernetes_configuration
        self.home_directory = Path(helm_home)

    @property
    def environment(self) -> Dict[str, str]:
        """
        Environment variables, in form of dictionary, with which helm mush be
        executed.
        """
        return {
            'HELM_CACHE_HOME': self.home_directory / 'cache',
            'HELM_CONFIG_HOME': self.home_directory / 'config',
            'HELM_DATA_HOME': self.home_directory / 'data',
            'KUBECONFIG': self.configuration
        }

    @property
    def subcommand(self) -> str:
        """
        Helm subcommand.
        """
        raise NotImplementedError

    def _formup_command(self, *args, **kwargs) -> str:
        positional_args = ' '.join(args)
        key_value_args = ' '.join((f'--{key.replace("_", "-")}={value}' for key, value in kwargs.items()))
        return f'{settings.HELM_EXECUTABLE} {self.subcommand} {positional_args} {key_value_args}'.strip()

    async def _run_command(self, command: str) -> str:
        """
        Executes helm CLI command.
        """
        return await run(command=command, environment=self.environment)
