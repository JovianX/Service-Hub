"""
Added Application.ttl property.

Revision ID: 17ba98259c52
Revises: e8700095ac3e
Create Date: 2022-11-28 16:06:05.282750
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '17ba98259c52'
down_revision = 'e8700095ac3e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('application', sa.Column('ttl', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('application', 'ttl')
