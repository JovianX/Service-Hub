from constants.kubernetes import K8sKinds
from exceptions.shell import NonZeroStatusException
from exceptions.kubernetes import KubectlException

from .base import KubectlBase


class KubectlLogs(KubectlBase):
    """
    Class responsible for working with `logs` kubctl subcommand.
    """

    subcommand = 'logs'

    async def get(self, context_name: str, namespace: str, kind: K8sKinds, entity_name) -> str:
        """
        Deteles given context from configuration.
        """
        command = self._formup_command(f'{kind}/{entity_name}', context=context_name, namespace=namespace)
        try:
            return await self._run_command(command)
        except NonZeroStatusException as error:
            raise KubectlException(
                f'Failed to fetch "{entity_name}" logs.',
                command=command, stderr=error.stderr_message, exit_code=error.status_code
            )
