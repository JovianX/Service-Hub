"""
Template.created_at not nullable.

Revision ID: 3e3db8879742
Revises: a30521cd80ca
Create Date: 2022-07-28 16:35:43.894834
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '3e3db8879742'
down_revision = 'a30521cd80ca'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        'template_revision',
        'created_at',
        existing_type=postgresql.TIMESTAMP(),
        nullable=False,
        existing_server_default=sa.text('now()')
    )


def downgrade() -> None:
    op.alter_column(
        'template_revision',
        'created_at',
        existing_type=postgresql.TIMESTAMP(),
        nullable=True,
        existing_server_default=sa.text('now()')
    )
