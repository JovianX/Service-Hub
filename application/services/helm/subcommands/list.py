"""
Implementation of helm list subcommand.
"""
from typing import List

import yaml

from ..schemas import ReleaseSchema
from .base import HelmBase


class HelmList(HelmBase):
    """
    Class responsible for working with `list` helm subcommand.
    """
    subcommand = 'list'

    async def releases(self, namespace: str = None) -> List[ReleaseSchema]:
        """
        Lists all releases.

        Full description: https://helm.sh/docs/helm/helm_list/
        """
        if namespace:
            command = self._formup_command(namespace=namespace, output='yaml')
        else:
            command = self._formup_command('--all-namespaces', output='yaml')
        output = await self._run_command(command)
        releases = yaml.safe_load(output)

        return [ReleaseSchema.parse_obj(release) for release in releases]
