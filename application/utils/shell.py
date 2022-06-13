import asyncio
import os
from typing import Dict

from ..exceptions.shell import NonZeroStatusException


async def run(command: str, environment: Dict[str, str] = {}, raise_exception: bool = True):
    """
    Runs asynchronously shell command.
    """
    system_environment = os.environ.copy()
    process = await asyncio.create_subprocess_shell(
        command,
        stderr=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        env={key: str(value) for key, value in {**system_environment, **environment}.items()}
    )

    stdout, stderr = await process.communicate()

    if process.returncode != 0 and raise_exception:
        raise NonZeroStatusException(
            command=command,
            stderr_message=stderr.decode(),
            status_code=process.returncode
        )

    return stdout.decode()
