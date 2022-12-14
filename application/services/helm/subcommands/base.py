from pathlib import Path

from core.configuration import settings
from exceptions.kubernetes import ClusterUnreachableException
from exceptions.shell import NonZeroStatusException
from utils.shell import run


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
    def environment(self) -> dict[str, str]:
        """
        Environment variables, in form of dictionary, with which helm mush be
        executed.
        """
        return {
            'HELM_CACHE_HOME': self.home_directory / 'cache',
            'HELM_CONFIG_HOME': self.home_directory / 'config',
            'HELM_DATA_HOME': self.home_directory / 'data',
            'HELM_PLUGINS': settings.HELM_PLUGINS_DIRECTORY,
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
        key_value_args = ' '.join((f'--{key.replace("_", "-")}="{value}"' for key, value in kwargs.items()))

        return f'{settings.HELM_EXECUTABLE} {self.subcommand} {positional_args} {key_value_args}'.strip()

    async def _run_command(self, command: str, directory: str = None) -> str:
        """
        Executes helm CLI command.
        """
        return await run(command=command, environment=self.environment, directory=directory)


class HandleUnreachableClusterMixin:
    """
    Mixing to handle unprocessable Kubernetes cluster.
    """
    async def _run_command(self, command: str, directory: str = None) -> str:
        """
        Executes helm CLI command.
        """
        try:
            return await super()._run_command(command=command, directory=directory)
        except NonZeroStatusException as error:
            error_message = error.stderr_message.strip()
            if 'Kubernetes cluster unreachable' in error_message:
                raise ClusterUnreachableException()
