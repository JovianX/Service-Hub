import re

import yaml

from exceptions.helm import ReleaseUpdateException
from exceptions.shell import NonZeroStatusException
from utils.temporary_file import yaml_temporary_file

from .base import HelmBase


RELEASE_NOT_FOUND_MESSAGE_PATTERN = re.compile(
    r'Error: UPGRADE FAILED: "(?P<release_name>.*)" has no deployed releases'
)
CHART_NOT_FOUND_MESSAGE_PATTERN = re.compile(r'Error: failed to download "(?P<repository_name>.*)/(?P<chart_name>.*)"')
COMMON_ERROR_MESSAGE_PATTERN = re.compile(r'Error: UPGRADE FAILED: (?P<error_message>.*)')


class HelmUpgrade(HelmBase):
    """
    Class responsible for working with `upgrade` helm subcommand.
    """

    subcommand = 'upgrade'

    async def release(
        self, context_name: str, namespace: str, release_name: str, chart: str, values: list[dict], debug: bool = False,
        dry_run: bool = False
    ) -> None:
        """
        Updates installed release.

        Full description: https://helm.sh/docs/helm/helm_upgrade/
        """
        args = [release_name, chart, '--reuse-values']
        if debug:
            args.append('--debug')
        if dry_run:
            args.append('--dry-run')
        values_temporary_files = []
        for values_part in values or []:
            temporary_file = yaml_temporary_file()
            values_temporary_files.append(temporary_file)
            yaml.safe_dump(values_part, temporary_file)
            args.append(f'--values={temporary_file.name}')

        command = self._formup_command(*args, kube_context=context_name, namespace=namespace, output='yaml')
        try:
            output = await self._run_command(command)
        except NonZeroStatusException as error:
            error_message = error.stderr_message.strip()
            match = RELEASE_NOT_FOUND_MESSAGE_PATTERN.search(error_message)
            if match:
                absent_relase = match.groupdict()['release_name']
                raise ReleaseUpdateException(
                    f'Failed to upgrade release. Release "{absent_relase}" not found in namespace "{namespace}".'
                )
            match = CHART_NOT_FOUND_MESSAGE_PATTERN.search(error_message)
            if match:
                chart_repository_name = match.groupdict()['repository_name']
                chart_name = match.groupdict()['chart_name']
                raise ReleaseUpdateException(
                    f'Failed to upgrade release "{release_name}" in namespace "{namespace}". '
                    f'Failed to find "{chart_repository_name}" repository or chart "{chart_name}" in it.'
                )
            match = COMMON_ERROR_MESSAGE_PATTERN.search(error_message)
            if match:
                common_error_message = match.groupdict()['error_message']
                raise ReleaseUpdateException(
                    f'Failed to upgrade release "{release_name}" in namespace "{namespace}". '
                    f'Error: {common_error_message}.'
                )
            raise
        finally:
            for file in values_temporary_files:
                file.close()

        return yaml.safe_load(output)
