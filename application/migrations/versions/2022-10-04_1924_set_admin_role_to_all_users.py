"""
Set admin role to all users.

Revision ID: 69b38d90ab50
Revises: 9ee2947cff15
Create Date: 2022-10-04 19:24:52.838679
"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '69b38d90ab50'
down_revision = '9ee2947cff15'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("UPDATE public.user SET role = 'admin'")


def downgrade() -> None:
    op.execute('UPDATE public.user SET role = NULL')
