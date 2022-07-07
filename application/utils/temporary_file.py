"""
Utilites related with temporary files usage.
"""
from tempfile import NamedTemporaryFile
from tempfile import _TemporaryFileWrapper

from application.core.configuration import settings


def yaml_temporary_file() -> _TemporaryFileWrapper:
    """
    Returns YAML temporary file.
    """
    return NamedTemporaryFile(mode='w', suffix='.yaml', dir=settings.FILE_STORAGE_ROOT)
