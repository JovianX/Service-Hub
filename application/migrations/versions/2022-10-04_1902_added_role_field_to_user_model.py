"""
Added role field to User model.

Revision ID: 9ee2947cff15
Revises: 49b259b4f68d
Create Date: 2022-10-04 19:02:34.876218
"""
import sqlalchemy as sa
from alembic import op
from constants.roles import Roles
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '9ee2947cff15'
down_revision = '49b259b4f68d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    user_roles = postgresql.ENUM(Roles, name='user_roles')
    user_roles.create(op.get_bind(), checkfirst=True)

    op.add_column('user', sa.Column('role', user_roles, nullable=True))


def downgrade() -> None:
    op.drop_column('user', 'role')
    user_roles = postgresql.ENUM(Roles, name='user_roles')
    user_roles.drop(op.get_bind())
