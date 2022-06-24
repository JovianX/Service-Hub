from typing import List

import yaml

from ..schemas import ManifestSchema
from .base import HelmBase


class HelmGet(HelmBase):
    """
    Class responsible for working with `get` helm subcommand.
    """

    subcommand = 'get'

    async def manifest(self, context_name: str, namespace: str, release_name: str) -> List[ManifestSchema]:
        """
        Returns release entity list.

        Full description: https://helm.sh/docs/helm/helm_get_manifest/
        """
        command = self._formup_command('manifest', release_name, kube_context=context_name, namespace=namespace)
        output = await self._run_command(command)
        parsed_manifests = [yaml.safe_load(item) for item in output.split('---\n') if item]
        manifests = []
        for parsed_manifest in parsed_manifests:
            manifest = ManifestSchema.parse_obj(parsed_manifest)
            if not manifest.metadata.namespace:
                # Not for all entities namespace is present. Setting it for our
                # further usage convenience.
                manifest.metadata.namespace = namespace
            manifests.append(manifest)

        return manifests
