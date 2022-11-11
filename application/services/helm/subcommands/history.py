import yaml

from ..schemas import ReleaseRevisionSchema
from .base import HelmBase


class HelmHistory(HelmBase):
    """
    Class responsible for working with `history` helm subcommand.
    """

    subcommand = 'history'

    async def get(self, context_name: str, namespace: str, release_name: str,) -> list[ReleaseRevisionSchema]:
        """
        Return list of release revisions.

        Full description: https://helm.sh/docs/helm/helm_history/
        """
        command = self._formup_command(release_name, kube_context=context_name, namespace=namespace, output='yaml')
        revisions_yaml = await self._run_command(command)
        parsed_revisions = yaml.safe_load(revisions_yaml) or []

        return [ReleaseRevisionSchema.parse_obj(revision) for revision in parsed_revisions]
