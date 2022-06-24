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
            no_repository_added_message = 'Error: no repositories to show'
            error_message = error.stderr_message.strip()
            if error_message == no_repository_added_message:
                return []
            raise

        return yaml.safe_load(output)

    async def update(self):
        """
        Updates repository cache.

        Full description: https://helm.sh/docs/helm/helm_repo_update/
        """
        command = self._formup_command('update')
        try:
            await self._run_command(command)
        except NonZeroStatusException as error:
            no_repository_message = 'Error: no repositories found. You must add one before updating'
            error_message = error.stderr_message.strip()
            if error_message == no_repository_message:
                return
            raise
