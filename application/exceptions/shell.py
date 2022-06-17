"""
Exceptions related with execution shell commands.
"""
from .base import ServiceHubException


class NonZeroStatusException(ServiceHubException):
    """
    Returned when shell command execution finished with non zero status.
    """

    def __init__(self, command: str, stderr_message: str, status_code: int) -> None:
        self.command = command
        self.stderr_message = stderr_message
        self.status_code = status_code
        super().__init__(stderr_message)
