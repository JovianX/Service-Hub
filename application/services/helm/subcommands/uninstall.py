from .base import HelmBase


class HelmUninstall(HelmBase):
    """
    Class responsible for working with `uninstall` helm subcommand.
    """

    subcommand = 'uninstall'

    async def release(self, context_name: str, namespace: str, release_name: str) -> None:
        """
        Removes installed release.

        Full description: https://helm.sh/docs/helm/helm_uninstall/
        """
        command = self._formup_command(release_name, kube_context=context_name, namespace=namespace)
        await self._run_command(command)
