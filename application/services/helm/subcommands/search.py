import yaml

from exceptions.shell import NonZeroStatusException

from ..schemas import ChartSchema
from .base import HelmBase


class HelmSearch(HelmBase):
    """
    Class responsible for working with `search` helm subcommand.

    """

    subcommand = 'search'

    async def charts(self, chart_name: str | None = None, show_development_versions: bool = False,
                     version_filter: str | None = None, list_versions: bool = False) -> list[ChartSchema]:
        """
        Searches for chart across all repositories.

        Full description: https://helm.sh/docs/helm/helm_search_repo/
        """
        args = [
            'repo',
        ]
        if chart_name is not None:
            args.append(chart_name)
        if show_development_versions:
            args.append('--devel')
        if list_versions:
            args.append('--versions')
        kwargs = {
            'output': 'yaml'
        }
        if version_filter:
            kwargs['version'] = version_filter
        command = self._formup_command(*args, **kwargs)

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
