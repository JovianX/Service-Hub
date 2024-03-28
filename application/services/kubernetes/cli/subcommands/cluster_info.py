from exceptions.kubernetes import KubectlException
from exceptions.shell import NonZeroStatusException

from .base import KubectlBase


class KubectlClusterInformation(KubectlBase):
    """
    Class responsible for working with `cluster-info` kubctl subcommand.
    """

    subcommand = 'cluster-info'

    @property
    def environment(self) -> dict[str, str]:
        environment = super().environment
        # cluster-info returns colorized output and doesn't have flag to disable
        # it. To avoid clearing color symbols from text we telling to kubectl to
        # not waste efforts, because our terminal will not understand it anyway.
        environment['TERM'] = 'dumb'

        return environment

    async def get(self, context_name: str) -> dict[str, str]:
        """
        Display addresses of the control plane and services.
        """
        command = self._formup_command(context=context_name)
        cluster_info = {}
        try:
            output = await self._run_command(command)
            for row in output.strip().split('\n'):
                splited_row = row.split(' is running at ')
                if len(splited_row) == 2:
                    cluster_info[splited_row[0]] = splited_row[1]
        except NonZeroStatusException as error:
            raise KubectlException(
                f'Failed to fetch cluster information.',
                command=command, stderr=error.stderr_message, exit_code=error.status_code
            )

        return cluster_info
