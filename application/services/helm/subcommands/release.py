import logging
from pathlib import Path

import yaml
from fastapi import status

from exceptions.common import CommonException
from exceptions.shell import NonZeroStatusException

from .base import HelmBase


logger = logging.getLogger(__name__)


class HelmRelease(HelmBase):
    """
    Class responsible for working with `release` command.
    For more details visit plugin github page:
    https://github.com/JovianX/helm-release-plugin.
    """

    subcommand = 'release'

    async def create_chart(
        self, context_name: str, namespace: str, release_name: str, targer_directory: str | Path
    ) -> Path:
        """
        Creates chart from existing release. Returns path to dumped chart.
        """
        targer_directory = Path(targer_directory)
        command = self._formup_command(
            'pull',
            release_name,
            kube_context=context_name,
            namespace=namespace,
            destination=targer_directory,
            output='yaml'
        )
        try:
            output = await self._run_command(command)
        except NonZeroStatusException:
            logger.exception(
                f'Failed to create chart from release. Release: "{release_name}", namespace: "{namespace}"'
            )
            raise
        parsed_output = yaml.safe_load(output)
        chart_directory = parsed_output.get('chart_directory')
        if not chart_directory:
            logger.error(f'`helm release pull` did not return chart directory. Full command: `{command}`.')
            raise CommonException(
                f'Failed to dump chart.',
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return targer_directory / chart_directory
