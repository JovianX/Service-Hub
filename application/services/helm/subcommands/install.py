import re

import yaml

from application.exceptions.helm import ChartInstallException
from application.exceptions.helm import ChartNotFoundException
from application.exceptions.helm import ReleaseAlreadyExistsException
from application.exceptions.helm import RepositoryNotFoundException
from application.exceptions.shell import NonZeroStatusException
from application.utils.temporary_file import yaml_temporary_file

from .base import HelmBase


REPOSITORY_NOT_FOUND_ERROR_MESSAGE_PATTERN = re.compile(
    r'Error: INSTALLATION FAILED: repo (?P<repository_name>.*) not found'
)
CHART_NOT_FOUND_ERROR_MESSAGE_PATTERN = re.compile(
    r'''Error: INSTALLATION FAILED: chart "(?P<chart_name>.*)" matching  not found in roboll index. \(try 'helm repo '''
    r'''update'\): no chart name found'''
)
CHART_INSTALL_FAILED_ERROR_MESSAGE_PATTERN = re.compile(r'Error: INSTALLATION FAILED: (?P<error_message>.*)')


class HelmInstall(HelmBase):
    """
    Class responsible for working with `install` helm subcommand.
    """

    subcommand = 'install'

    async def chart(
        self, context_name: str, namespace: str, release_name: str, chart_name: str, values: list[dict] | None = None,
        version: str | None = None, description: str | None = None, debug: bool = False, dry_run: bool = False
    ) -> dict:
        """
        Upgrades chart if required able to install absent release.

        Full description: https://helm.sh/docs/helm/helm_install/
        """
        values_temporary_files = []

        args = [
            release_name,
            chart_name,
            '--create-namespace',
        ]
        kwargs = {
            'output': 'yaml',
            'kube_context': context_name,
            'namespace': namespace
        }
        if version:
            kwargs['version'] = version
        if description:
            kwargs['description'] = description
        if debug:
            args.append('--debug')
        if dry_run:
            args.append('--dry-run')
        for values_part in values or []:
            temporary_file = yaml_temporary_file()
            values_temporary_files.append(temporary_file)
            yaml.safe_dump(values_part, temporary_file)
            args.append(f'--values={temporary_file.name}')

        command = self._formup_command(*args, **kwargs)
        try:
            output = await self._run_command(command)
        except NonZeroStatusException as error:
            release_already_exists_error_message = 'Error: INSTALLATION FAILED: cannot re-use a name that is still ' \
                                                   'in use'
            error_message = error.stderr_message.strip()
            if error_message == release_already_exists_error_message:
                raise ReleaseAlreadyExistsException(
                    f'Failed to install chart "{chart_name}". Release with name "{release_name}" already exists.'
                )
            repository_not_found_match = REPOSITORY_NOT_FOUND_ERROR_MESSAGE_PATTERN.search(error_message)
            if repository_not_found_match:
                repository_name = repository_not_found_match.groupdict()['repository_name']
                raise RepositoryNotFoundException(
                    f'Failed to install chart "{chart_name}". Repository "{repository_name}" not found.'
                )
            chart_not_found_match = CHART_NOT_FOUND_ERROR_MESSAGE_PATTERN.search(error_message)
            if chart_not_found_match:
                absent_chart_name = chart_not_found_match.groupdict()['chart_name']
                raise ChartNotFoundException(
                    f'Failed to install chart "{chart_name}". Chart "{absent_chart_name}" not found.'
                )
            chart_install_failed_match = CHART_INSTALL_FAILED_ERROR_MESSAGE_PATTERN.search(error_message)
            if chart_install_failed_match:
                installation_error_message = chart_install_failed_match.groupdict()['error_message']
                raise ChartInstallException(
                    f'Failed to install chart "{chart_name}". Error: {installation_error_message}.'
                )

            raise
        finally:
            for file in values_temporary_files:
                file.close()

        return yaml.safe_load(output)
