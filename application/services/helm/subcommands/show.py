from .base import HelmBase


class HelmShow(HelmBase):
    """
    Class responsible for working with `Show` helm subcommand.
    """

    subcommand = 'show'

    async def values(self, chart_name: str) -> str:
        """
        Gets chart default values(the values.yaml file).

        Full description: https://helm.sh/docs/helm/helm_show_values/
        """
        command = self._formup_command('values', chart_name)
        values_file_yaml = await self._run_command(command)

        return values_file_yaml
