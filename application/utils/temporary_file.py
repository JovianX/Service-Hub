"""
Utilites related with temporary files usage.
"""
from tempfile import NamedTemporaryFile
from application.core.configuration import settings


def yaml_temporary_file():
    """
    Returns YAML temporary file.
    """
    return NamedTemporaryFile(mode='w', suffix='.yaml', dir=settings.FILE_STORAGE_ROOT)
