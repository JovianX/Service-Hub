"""
Rename application statuses.

Revision ID: e8700095ac3e
Revises: f6ed2d61f1fb
Create Date: 2022-11-17 12:43:42.865919
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e8700095ac3e'
down_revision = 'f6ed2d61f1fb'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("UPDATE application SET status = 'deploy_requested' where status = 'created'")
    op.execute("UPDATE application SET status = 'deploying' where status = 'starting'")
    op.execute("UPDATE application SET status = 'deployed' where status = 'running'")
    op.execute("UPDATE application SET status = 'upgrading' where status = 'updating'")


def downgrade() -> None:
    op.execute("UPDATE application SET status = 'created' where status = 'deploy_requested'")
    op.execute("UPDATE application SET status = 'starting' where status = 'deploying'")
    op.execute("UPDATE application SET status = 'running' where status = 'deployed'")
    op.execute("UPDATE application SET status = 'updating' where status = 'upgrading'")
