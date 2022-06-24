from typing import Dict

from application.core.configuration import settings
from application.utils.shell import run


class KubectlBase:
    """
    Base class for all kubectl commands.
    """
    configuration: str

    def __init__(self, kubernetes_configuration: str) -> None:
        """
        Parameters:
        kubernetes_configuration - path to Kubernetes configuration file.
        """
        self.configuration = kubernetes_configuration

    @property
    def environment(self) -> Dict[str, str]:
        """
        Environment variables, in form of dictionary, with which kubectl mush be
        executed.
        """
        return {
            'KUBECONFIG': self.configuration
        }

    @property
    def subcommand(self) -> str:
        """
        kubectl subcommand.
        """
        raise NotImplementedError

    def _formup_command(self, *args, **kwargs) -> str:
        positional_args = ' '.join(args)
        key_value_args = ' '.join((f'--{key}={value}' for key, value in kwargs.items()))
        return f'{settings.KUBECTL_EXECUTABLE} {self.subcommand} {positional_args} {key_value_args}'.strip()

    async def _run_command(self, command: str) -> str:
        """
        Executes helm CLI command.
        """
        return await run(command=command, environment=self.environment)
