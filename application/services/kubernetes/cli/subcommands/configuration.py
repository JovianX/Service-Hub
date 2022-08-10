from fastapi import status

from exceptions.common import CommonException
from exceptions.shell import NonZeroStatusException

from .base import KubectlBase


class KubectlConfig(KubectlBase):
    """
    Class responsible for working with `config` kubctl subcommand.
    """

    subcommand = 'config'

    async def delete_context(self, context_name: str) -> None:
        """
        Deteles given context from configuration.
        """
        command = self._formup_command('delete-context', context_name)
        try:
            await self._run_command(command)
        except NonZeroStatusException as error:
            error_message = f'error: cannot delete context {context_name}, not in'
            if error.stderr_message.startswith(error_message):
                raise CommonException(
                    f'Context with name "{context_name}" does not exists in organization\'s Kubernetes configuration.',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            raise
