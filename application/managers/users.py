"""
Functionality responsible for handling users business logic.
"""
import logging
import uuid

from fastapi import Depends
from fastapi import Request
from fastapi_users import BaseUserManager
from fastapi_users import UUIDIDMixin
from fastapi_users import exceptions

from constants.events import EventCategory
from constants.roles import Roles
from core.configuration import settings
from crud.users import UserDatabase
from crud.users import get_user_db
from exceptions.organization import DifferentOrganizationException
from managers.events import EventManager
from managers.events import get_event_manager
from managers.helm.manager import HelmManager
from managers.invitations import InvitationManager
from managers.invitations import get_invitation_manager
from managers.organizations.manager import OrganizationManager
from managers.organizations.manager import get_organization_manager
from managers.templates import TemplateManager
from managers.templates import get_template_manager
from models.invitation import UserInvitation
from models.organization import Organization
from models.user import User
from schemas.events import EventSchema
from schemas.users import UserCreate
from utils.email import send_email


logger = logging.getLogger(__name__)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.SECRET
    verification_token_secret = settings.SECRET
    invitation_record: UserInvitation | None = None

    def __init__(self, user_db: UserDatabase, organizations: OrganizationManager, invitation_manager: InvitationManager,
                 template_manager: TemplateManager, event_manager: EventManager):
        self.organizations = organizations
        self.invitation_manager = invitation_manager
        self.helm_manager = HelmManager(organizations)
        self.template_manager = template_manager
        self.event_manager = event_manager
        super().__init__(user_db)

    async def create(self, user_create: UserCreate, safe: bool = False, request: Request | None = None) -> User:
        """
        Create a user in database.

        Triggers the on_after_register handler on success.

        :param user_create: The UserCreate model to create.
        :param safe: If True, sensitive values like is_superuser or is_verified
        will be ignored during the creation, defaults to False.
        :param request: Optional FastAPI request that
        triggered the operation, defaults to None.
        :raises UserAlreadyExists: A user already exists with the same e-mail.
        :return: A new user.
        """
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        await self.on_before_register(user_dict, request)
        password = user_dict.pop('password')
        user_dict['hashed_password'] = self.password_helper.hash(password)
        created_user = await self.user_db.create(user_dict)

        await self.on_after_register(created_user, request)

        return created_user

    async def oauth_callback(
        self,
        oauth_name: str,
        access_token: str,
        account_id: str,
        account_email: str,
        expires_at: int | None = None,
        refresh_token: str | None = None,
        request: Request | None = None,
        *,
        associate_by_email: bool = False
    ) -> User:
        """
        Handle the callback after a successful OAuth authentication.

        If the user already exists with this OAuth account, the token is updated.

        If a user with the same e-mail already exists and `associate_by_email` is True,
        the OAuth account is associated to this user.
        Otherwise, the `UserNotExists` exception is raised.

        If the user does not exist, it is created and the on_after_register handler
        is triggered.

        :param oauth_name: Name of the OAuth client.
        :param access_token: Valid access token for the service provider.
        :param account_id: models.ID of the user on the service provider.
        :param account_email: E-mail of the user on the service provider.
        :param expires_at: Optional timestamp at which the access token expires.
        :param refresh_token: Optional refresh token to get a
        fresh access token from the service provider.
        :param request: Optional FastAPI request that
        triggered the operation, defaults to None
        :param associate_by_email: If True, any existing user with the same
        e-mail address will be associated to this user. Defaults to False.
        :return: A user.
        """
        oauth_account_dict = {
            'oauth_name': oauth_name,
            'access_token': access_token,
            'account_id': account_id,
            'account_email': account_email,
            'expires_at': expires_at,
            'refresh_token': refresh_token,
        }

        try:
            user = await self.get_by_oauth_account(oauth_name, account_id)
        except exceptions.UserNotExists:
            try:
                # Associate account
                user = await self.get_by_email(account_email)
                if not associate_by_email:
                    raise exceptions.UserAlreadyExists()
                user = await self.user_db.add_oauth_account(user, oauth_account_dict)
            except exceptions.UserNotExists:
                # Create account
                password = self.password_helper.generate()
                user_dict = {
                    'email': account_email,
                    'hashed_password': self.password_helper.hash(password)
                }
                await self.on_before_register(user_dict, request)
                user = await self.user_db.create(user_dict)
                user = await self.user_db.add_oauth_account(user, oauth_account_dict)
                await self.on_after_register(user, request)
        else:
            # Update oauth
            for existing_oauth_account in user.oauth_accounts:
                if (
                    existing_oauth_account.account_id == account_id
                    and existing_oauth_account.oauth_name == oauth_name
                ):
                    user = await self.user_db.update_oauth_account(
                        user, existing_oauth_account, oauth_account_dict
                    )

        return user

    async def on_before_register(self, user: dict, request: Request | None = None):
        organization: Organization | None = None
        invitation_id = request.query_params.get('invite_id')
        if invitation_id:
            self.invitation_record = await self.invitation_manager.get_invitation_by_id(invitation_id)
            self.invitation_manager.is_valid(self.invitation_record)
            organization = self.invitation_record.organization

        if organization is None:
            organization = await self.organizations.create()
            event = EventSchema(
                organization_id=organization.id,
                title='Organization created',
                message=f'Welcome to Service Hub. Have a lot of fun here!',
                category=EventCategory.organization,
                data={'creator_email': user['email']}
            )
            await self.event_manager.create(event)

        user['organization_id'] = organization.id

    async def on_after_register(self, user: User, request: Request | None = None):
        # Setting user role
        users = await self.user_db.list(organization_id=user.organization.id)
        if len(users) > 1:
            user.role = Roles.operator
        else:
            user.role = Roles.admin
        await self.user_db.save(user)

        if self.invitation_record:
            await self.invitation_manager.use(self.invitation_record, user)

        # Creating initial organization's repository and template.
        await self.helm_manager.add_repository(
            user.organization, 'Bitnami', settings.INITIAL_ORGANIZATION_REPOSITORY_URL
        )
        if settings.INITIAL_ORGANIZATION_TEMPLATE:
            await self.template_manager.create_template(
                user,
                settings.INITIAL_ORGANIZATION_TEMPLATE,
                description='Template example.',
                enabled=True
            )

    async def on_after_forgot_password(self, user: User, token: str, request: Request | None = None):
        link = f'{settings.UI_HOST}/reset-password?token={token}'
        await send_email(
            user.email,
            f'Password reset request',
            f'To reset forgotten password click following link: {link}'
        )

    async def on_after_request_verify(self, user: User, token: str, request: Request | None = None):
        pass

    async def organization_users(self, organization: Organization) -> list[User]:
        """
        Returns list of organization's users.
        """
        return await self.user_db.list(organization_id=organization.id)

    async def on_before_delete(self, user: User, request: Request | None = None) -> None:
        await self.user_db.delete_oauth_account(user)
        if user.invitation is not None:
            await self.invitation_manager.delete_invitation(user.invitation, force=True)

    async def set_user_role(self, setter: User, user: User, role: Roles) -> None:
        """
        Sets user role.
        """
        if setter.organization.id != user.organization.id:
            logger.critical(
                f'Attempt of alter entity of different organization. '
                f'<User id={setter.id} organization={setter.organization.id}> tried to change role of '
                f'<User id={user.id} organization={user.organization.id}> from "{user.role}" to "{role}".'
            )
            raise DifferentOrganizationException()
        user.role = role
        await self.user_db.save(user)


async def get_user_manager(
    user_db=Depends(get_user_db),
    organization_manager=Depends(get_organization_manager),
    invitation_manager=Depends(get_invitation_manager),
    template_manager=Depends(get_template_manager),
    event_manager=Depends(get_event_manager),
):
    yield UserManager(user_db, organization_manager, invitation_manager, template_manager, event_manager)
