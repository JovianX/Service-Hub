from typing import List

import yaml

from application.exceptions.shell import NonZeroStatusException

from .base import HelmBase


class HelmRepository(HelmBase):
    """
    Class responsible for working with `repo` helm subcommand.
    """

    subcommand = 'repo'

    async def add(self, name: str, url: str):
        """
        Adds a chart repository.

        Full description: https://helm.sh/docs/helm/helm_repo_add/
        """
        command = self._formup_command('add', name, url)
        await self._run_command(command)

    async def list(self) -> List[dict]:
        """
        Lists all chart repositories.

        Full description: https://helm.sh/docs/helm/helm_repo_list/
        """
        command = self._formup_command('list', output='yaml')
        try:
            output = await self._run_command(command)
        except NonZeroStatusException as error:
            if error.stderr_message.strip() == 'Error: no repositories to show':
                return []
            raise

        return yaml.safe_load(output)
