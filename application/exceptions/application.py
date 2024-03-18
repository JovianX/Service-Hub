"""
Application entity related exceptions.
"""
from fastapi import status

from .common import CommonException


class ApplicationException(CommonException):
    """
    Common exception related with application instance.
    """

    def __init__(self, message: str | None = None, status_code: int | None = None, *, application) -> None:
        message = message or 'Application operating malfunction.'
        status_code = status_code or status.HTTP_503_SERVICE_UNAVAILABLE
        self.application = application
        super().__init__(message=message, status_code=status_code)


################################################################################
# Applicatoin hooks exceptions
################################################################################


class ApplicationHookException(ApplicationException):
    """
    Common exception related with application hooks.
    """

    def __init__(self, message: str | None = None, status_code: int | None = None, *, application, hook) -> None:
        message = message or 'Application hook malfunction.'
        self.hook = hook
        super().__init__(message, status_code, application=application)


class ApplicationHookLaunchException(ApplicationHookException):
    """
    Raised when hook execution failed.
    """

    def __init__(self, message: str | None = None, status_code: int | None = None, *, application, hook, log) -> None:
        self.log = log
        super().__init__(message, status_code, application=application, hook=hook)


class ApplicationHookTimeoutException(ApplicationHookException):
    """
    Raised when hook execution reached its time deadline.
    """


################################################################################
# Applicatoin components exceptions
################################################################################


class ApplicationComponentException(ApplicationException):
    """
    Common exception related with application component.
    """

    def __init__(self, message: str | None = None, status_code: int | None = None, *, application, component) -> None:
        message = message or 'Application hook malfunction.'
        self.component = component
        super().__init__(message, status_code, application=application)


class ApplicationComponentInstallException(ApplicationComponentException):
    """
    Raised when application component failed to install.
    """


class ApplicationComponentUpdateException(ApplicationComponentException):
    """
    Raised when application component failed to update helm values.
    """


class ApplicationComponentUninstallException(ApplicationComponentException):
    """
    Raised when application component failed to uninstall.
    """


class ApplicationComponentInstallTimeoutException(ApplicationComponentException):
    """
    Raised when application component failed to install in time.
    """
