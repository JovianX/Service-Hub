"""
Added Application.ttl property.

Revision ID: 17ba98259c52
Revises: 488fbe744acd
Create Date: 2022-11-28 16:06:05.282750
"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '17ba98259c52'
down_revision = '488fbe744acd'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('application', sa.Column('ttl', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('application', 'ttl')
