"""
Helpers related to archives.
"""
from pathlib import Path

from .shell import Command


async def tar(directory: str | Path, target_archive: str | Path | None = None, exclude: list | None = None) -> bytes:
    """
    Creates tar archive from given directory. If target archive is omitted
    archive content will be returned.
    """
    command = Command('tar')
    command << '.'
    command['gzip']
    command['create']
    command['directory'] = Path(directory)
    if target_archive:
        command['file'] = Path(target_archive)
    else:
        command.bytes_output = True
    for exclude_item in exclude or []:
        command['exclude'] = Path(exclude_item)

    return await command.run()


async def untar(target_directory: str | Path, archive: str | Path):
    """
    Extracts tar archive into to target directory.
    """
    command = Command('tar')
    command['extract']
    command['gzip']
    command['directory'] = Path(target_directory)
    command['file'] = Path(archive)

    return await command.run()
