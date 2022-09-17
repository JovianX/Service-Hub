import logging
from datetime import datetime
from datetime import timedelta
from pathlib import Path

import yaml
from fastapi import status

from exceptions.common import CommonException
from exceptions.shell import NonZeroStatusException
from utils.temporary_file import yaml_temporary_file
from exceptions.helm import ReleaseUpdateException

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
            raise CommonException(f'Failed to dump chart.', status_code=status.HTTP_503_SERVICE_UNAVAILABLE)

        return targer_directory / chart_directory

    async def set_ttl(self, context_name: str, namespace: str, release_name: str, time_delta: timedelta) -> None:
        """
        Sets release TTL(time to live) after which release delete.
        """
        minutes = int(time_delta.total_seconds() / 60)
        if minutes < 1:
            raise ValueError(f'Invalid release TTL. TTL must be greater than 1 minute.')
        command = self._formup_command(
            'ttl',
            release_name,
            kube_context=context_name,
            namespace=namespace,
            set=f'{minutes} minutes'
        )
        try:
            await self._run_command(command)
        except NonZeroStatusException:
            logger.exception(
                f'Failed to set release TTL. Release: "{release_name}", namespace: "{namespace}"'
            )
            raise

    async def read_ttl(self, context_name: str, namespace: str, release_name: str) -> datetime:
        """
        Returns date and time of release removal.
        """
        command = self._formup_command(
            'ttl',
            release_name,
            kube_context=context_name,
            namespace=namespace,
            output='yaml'
        )
        try:
            output = await self._run_command(command)
        except NonZeroStatusException as error:
            error_message = error.stderr_message.strip()
            if error_message.startswith('Error from server (NotFound): cronjobs.batch'):
                # No release TTL set yet.
                return
            logger.exception(
                f'Failed to read release TTL. Release: "{release_name}", namespace: "{namespace}"'
            )
            raise
        parsed_output = yaml.safe_load(output)
        release_deletion_date = parsed_output.get('scheduled_date')
        if not release_deletion_date:
            return

        return datetime.fromisoformat(release_deletion_date)

    async def unset_ttl(self, context_name: str, namespace: str, release_name: str) -> None:
        """
        Removes release TTL(time to live).
        """
        command = self._formup_command(
            'ttl',
            release_name,
            '--unset',
            kube_context=context_name,
            namespace=namespace
        )
        try:
            await self._run_command(command)
        except NonZeroStatusException:
            logger.exception(
                f'Failed to remove release TTL. Release: "{release_name}", namespace: "{namespace}"'
            )
            raise
