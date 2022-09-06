import logging
from pathlib import Path

from exceptions.shell import NonZeroStatusException

from .base import HelmBase


logger = logging.getLogger(__name__)


class HelmDependency(HelmBase):
    """
    Class responsible for working with `dependency` helm subcommand.
    """

    subcommand = 'dependency'

    async def build(self, context_name: str, namespace: str, chart_directory: str | Path) -> None:
        """
        Builds chart dependencies.
        """
        command = self._formup_command('build', str(chart_directory), kube_context=context_name, namespace=namespace)
        try:
            await self._run_command(command)
        except NonZeroStatusException:
            logger.exception(f'Failed to build chart dependencies.')
            raise
