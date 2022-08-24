import asyncio
import logging
import os
from pathlib import Path
from typing import Any

from exceptions.shell import NonZeroStatusException


logger = logging.getLogger(__name__)


class Command:
    """
    CLI command executor with positional, key-value parameters and flags.
    """
    executable: str
    positional_args: list
    flags: list
    key_value_args: list
    environment: dict[str, str] = None
    directory: str = None
    report_error: bool = True
    bytes_output: bool = False

    def __init__(self, executable: str) -> None:
        self.executable = executable
        self.positional_args = []
        self.flags = []
        self.key_value_args = []

    def __lshift__(self, argument) -> None:
        if isinstance(argument, Path):
            argument = f'"{argument}"'
        self.positional_args.append(argument)

    def __setitem__(self, name: str, value: Any) -> None:
        if isinstance(value, Path):
            value = f'"{value}"'
        argument = {
            'key': name,
            'value': value
        }
        self.key_value_args.append(argument)

    def __getitem__(self, name: str) -> None:
        self.flags.append(name)

    @property
    def command(self) -> str:
        """
        Forms up command as string.
        """
        positional_args = ' '.join(self.positional_args)
        flags = ' '.join((f'--{flag}' for flag in self.flags))
        key_value_args = ' '.join((f'--{item["key"]}={item["value"]}' for item in self.key_value_args))

        return f'{self.executable} {flags} {key_value_args} {positional_args}'

    async def run(self) -> str:
        """
        Executes command.
        """
        return await run(
            command=self.command,
            environment=self.environment,
            directory=self.directory,
            report_error=self.report_error,
            bytes_output=self.bytes_output
        )


async def run(
    command: str, environment: dict[str, str] = None, directory: str = None, report_error: bool = True,
    bytes_output: bool = False
) -> str | bytes:
    """
    Runs asynchronously shell command.
    """
    if environment is None:
        environment = {}
    system_environment = os.environ.copy()
    process = await asyncio.create_subprocess_shell(
        command,
        stderr=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        env={key: str(value) for key, value in {**system_environment, **environment}.items()},
        cwd=directory
    )

    stdout, stderr = await process.communicate()

    if process.returncode != 0 and report_error:
        raise NonZeroStatusException(
            command=command,
            stderr_message=stderr.decode(),
            status_code=process.returncode
        )
    if stderr and report_error:
        logger.warning(stderr.decode())

    return stdout if bytes_output else stdout.decode()
