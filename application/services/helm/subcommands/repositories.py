import yaml

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

    async def list(self):
        """
        Lists all chart repository.

        Full description: https://helm.sh/docs/helm/helm_repo_add/
        """
        command = self._formup_command('list', output='yaml')
        output = await self._run_command(command)

        return yaml.safe_load(output)
