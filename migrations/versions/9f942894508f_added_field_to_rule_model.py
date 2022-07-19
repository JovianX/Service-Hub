"""Added  field to Rule model.

Revision ID: 9f942894508f
Revises: 8f71135a4d68
Create Date: 2022-07-11 11:58:39.711020

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '9f942894508f'
down_revision = '8f71135a4d68'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('rule', sa.Column('enabled', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    op.drop_column('rule', 'enabled')
