from typing import List

import yaml

from exceptions.shell import NonZeroStatusException

from ..schemas import ChartSchema
from .base import HelmBase


class HelmSearch(HelmBase):
    """
    Class responsible for working with `search` helm subcommand.
    """

    subcommand = 'search'

    async def repositories(self) -> List[ChartSchema]:
        """
        Searches for repositories and displays charts detailed information.

        Full description: https://helm.sh/docs/helm/helm_search_repo/
        """
        command = self._formup_command('repo', output='yaml')

        try:
            output = await self._run_command(command)
        except NonZeroStatusException as error:
            no_repository_added_message = 'Error: no repositories configured'
            error_message = error.stderr_message.strip()
            if error_message == no_repository_added_message:
                return []
            raise
        parsed_charts = yaml.safe_load(output)

        return [ChartSchema.parse_obj(item) for item in parsed_charts]
