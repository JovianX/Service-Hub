"""
Implementation of helm list subcommand.
"""
from typing import List

import yaml

from ..schemas import ReleaseSchema
from .base import HandleUnreachableClusterMixin
from .base import HelmBase


class HelmList(HandleUnreachableClusterMixin, HelmBase):
    """
    Class responsible for working with `list` helm subcommand.
    """
    subcommand = 'list'

    async def releases(self, context_name: str, namespace: str = None) -> List[ReleaseSchema]:
        """
        Lists all releases.

        Full description: https://helm.sh/docs/helm/helm_list/
        """
        if namespace:
            command = self._formup_command(kube_context=context_name, namespace=namespace, output='yaml')
        else:
            command = self._formup_command('--all-namespaces', kube_context=context_name, output='yaml')
        output = await self._run_command(command)
        releases = yaml.safe_load(output)

        return [ReleaseSchema.parse_obj(release) for release in releases]
