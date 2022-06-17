"""
Implementation of helm list subcommand.
"""
from typing import List

import yaml

from .base import HelmBase


class HelmList(HelmBase):
    """
    Class responsible for working with `list` helm subcommand.
    """
    subcommand = 'list'

    async def releases(self, namespace: str = None) -> List[dict]:
        """
        Lists all releases.

        Full description: https://helm.sh/docs/helm/helm_list/
        """
        if namespace:
            command = self._formup_command(namespace=namespace, output='yaml')
        else:
            command = self._formup_command('--all-namespaces', output='yaml')
        output = await self._run_command(command)

        return yaml.safe_load(output)
