from application.models.user import User

from .subcommands.repositories import HelmRepository
from .subcommands.search import HelmSearch


class HelmManager:
    """
    Class that contains all helm commands.
    """

    def __init__(self, user: User) -> None:
        self.repository: HelmRepository = HelmRepository(user)
        self.search: HelmSearch = HelmSearch(user)
