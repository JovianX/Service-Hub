from typing import List

import yaml

from application.exceptions.shell import NonZeroStatusException
from application.exceptions.helm import RepositoryNotFoundException

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

    async def update(self) -> None:
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

    async def remove(self, repository_name: str) -> None:
        """
        Removes helm repository.

        Full description: https://helm.sh/docs/helm/helm_repo_remove/
        """
        command = self._formup_command('remove', repository_name)
        try:
            await self._run_command(command)
        except NonZeroStatusException as error:
            repository_not_found_message = f'Error: no repo named "{repository_name}" found'
            no_repositories_message = 'Error: no repositories configured'
            error_message = error.stderr_message.strip()
            if error_message in (repository_not_found_message, no_repositories_message):
                raise RepositoryNotFoundException(f'Repository "{repository_name}" does not exist.')
            raise
