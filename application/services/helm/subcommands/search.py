import yaml

from .base import HelmBase


class HelmSearch(HelmBase):
    """
    Class responsible for working with `search` helm subcommand.
    """

    subcommand = 'search'

    async def repositories(self):
        """
        Searches for repositories and displays charts detailed information.

        Full description: https://helm.sh/docs/helm/helm_search_repo/
        """
        command = self._formup_command('repo', output='yaml')

        output = await self._run_command(command)

        return yaml.safe_load(output)
