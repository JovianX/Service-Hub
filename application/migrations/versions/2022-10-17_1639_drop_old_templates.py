"""
Drop old templates.

Revision ID: c5f94e6d60ea
Revises: 69b38d90ab50
Create Date: 2022-10-17 16:39:59.985370
"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = 'c5f94e6d60ea'
down_revision = '69b38d90ab50'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('delete from application')
    op.execute('delete from template_revision')


def downgrade() -> None:
    pass
