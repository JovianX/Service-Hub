import yaml

from application.exceptions.shell import NonZeroStatusException
from application.utils.temporary_file import yaml_temporary_file
from application.exceptions.helm import ReleaseAlreadyExistsException

from .base import HelmBase


class HelmInstall(HelmBase):
    """
    Class responsible for working with `install` helm subcommand.
    """

    subcommand = 'install'

    async def chart(
        self,
        context_name: str,
        namespace: str,
        release_name: str,
        chart_name: str,
        values: dict | None = None,
        description: str | None = None
    ) -> dict:
        """
        Upgrades chart if required able to install absent release.

        Full description: https://helm.sh/docs/helm/helm_install/
        """
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

        if description:
            kwargs['description'] = description

        release_already_exists_error_message = 'Error: INSTALLATION FAILED: cannot re-use a name that is still in use'
        if values:
            with yaml_temporary_file() as temporary_file:
                yaml.safe_dump(values, temporary_file)
                kwargs['values'] = temporary_file.name
                command = self._formup_command(*args, **kwargs)
                try:
                    output = await self._run_command(command)
                except NonZeroStatusException as error:
                    error_message = error.stderr_message.strip()
                    if error_message == release_already_exists_error_message:
                        raise ReleaseAlreadyExistsException(
                            f'Failed to install chart "{chart_name}". Release with name "{release_name}" already '
                            f'exists.'
                        )
        else:
            command = self._formup_command(*args, **kwargs)
            try:
                output = await self._run_command(command)
            except NonZeroStatusException as error:
                error_message = error.stderr_message.strip()
                if error_message == release_already_exists_error_message:
                    raise ReleaseAlreadyExistsException(
                        f'Failed to install chart "{chart_name}". Release with name "{release_name}" already exists.'
                    )

        return yaml.safe_load(output)
