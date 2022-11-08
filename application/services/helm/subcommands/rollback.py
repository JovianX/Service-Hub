import logging

from exceptions.helm import ReleaseNotFoundException
from exceptions.shell import NonZeroStatusException

from .base import HelmBase


logger = logging.getLogger(__name__)


class HelmRollback(HelmBase):
    """
    Class responsible for working with `rollback` helm subcommand.
    """

    subcommand = 'rollback'

    async def revision(self, context_name: str, namespace: str, release_name: str, revision: int | None = None, *,
                       cleanup_on_fail: bool = False, dry_run: bool = False, force: bool = False,
                       no_hooks: bool = False, recreate_pods: bool = False) -> None:
        """
        Rollbacks release to given revision.

        Full description: https://helm.sh/docs/helm/helm_rollback/
        """
        args = [release_name]
        if revision is not None:
            args.append(str(revision))
        if cleanup_on_fail:
            args.append('--cleanup-on-fail')
        if dry_run:
            args.append('--dry-run')
        if force:
            args.append('--force')
        if no_hooks:
            args.append('--no-hooks')
        if recreate_pods:
            args.append('--recreate-pods')
        command = self._formup_command(*args, kube_context=context_name, namespace=namespace)

        try:
            return await self._run_command(command)
        except NonZeroStatusException as error:
            logger.exception(
                f'Failed to rollback release. Command: "{command}".'
            )
            release_not_found_error_message = 'Error: release: not found'
            error_message = error.stderr_message.strip()
            if error_message == release_not_found_error_message:
                raise ReleaseNotFoundException(
                    f'Failed to rollback release revision. Release "{release_name}" in namespace "{namespace}" does '
                    f'not exist.'
                )
