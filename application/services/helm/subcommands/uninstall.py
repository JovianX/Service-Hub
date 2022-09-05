import re

from exceptions.helm import ReleaseNotFoundException
from exceptions.shell import NonZeroStatusException

from .base import HelmBase


RELEASE_NOT_FOUND_ERROR_MESSAGE_PATTERN = re.compile(
    r'Error: uninstall: Release not loaded: (?P<release_name>.*): release: not found'
)


class HelmUninstall(HelmBase):
    """
    Class responsible for working with `uninstall` helm subcommand.
    """

    subcommand = 'uninstall'

    async def release(
        self, context_name: str, namespace: str, release_name: str, debug: bool = False, dry_run: bool = False
    ) -> None:
        """
        Removes installed release.

        Full description: https://helm.sh/docs/helm/helm_uninstall/
        """
        args = [release_name]
        if debug:
            args.append('--debug')
        if dry_run:
            args.append('--dry-run')

        command = self._formup_command(*args, kube_context=context_name, namespace=namespace)
        try:
            await self._run_command(command)
        except NonZeroStatusException as error:
            error_message = error.stderr_message.strip()
            release_not_found_match = RELEASE_NOT_FOUND_ERROR_MESSAGE_PATTERN.search(error_message)
            if release_not_found_match:
                absent_release_name = release_not_found_match.groupdict()['release_name']
                raise ReleaseNotFoundException(
                    f'Failed to uninstall release "{absent_release_name}". No such release in "{namespace}" namespace.'
                )
