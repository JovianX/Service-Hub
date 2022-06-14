from pathlib import Path
from typing import Dict

from application.core.configuration import settings
from application.models.user import User
from application.utils.shell import run


class HelmBase:
    """
    Base class for all helm commands.
    """
    user: User

    def __init__(self, user: User):
        self.user = user

    @property
    def configuration(self) -> str:
        """
        Path to Kubernetes configuration file.
        """
        return settings.KUBERNETES_CONFIGURATION

    @property
    def environment(self) -> Dict[str, str]:
        """
        Environment variables, in form of dictionary, with which helm mush be
        executed.
        """
        helm_root = Path(settings.FILE_STORAGE_ROOT) / str(self.user.id) / 'helm'
        return {
            'HELM_CACHE_HOME': helm_root / 'cache',
            'HELM_CONFIG_HOME': helm_root / 'config',
            'HELM_DATA_HOME': helm_root / 'data',
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
        key_value_args = ' '.join((f'--{key}={value}' for key, value in kwargs.items()))
        return f'{settings.HELM_EXECUTABLE} {self.subcommand} {positional_args} {key_value_args}'.strip()

    async def _run_command(self, command: str) -> str:
        """
        Executes helm CLI command.
        """
        return await run(command=command, environment=self.environment)
