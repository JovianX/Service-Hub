"""
Removed creator from AccessToken model.

Revision ID: cb7e2af4e17c
Revises: 288af7dbc2d6
Create Date: 2022-12-23 13:28:11.549646
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cb7e2af4e17c'
down_revision = '288af7dbc2d6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint('access_token_creator_id_fkey', 'access_token', type_='foreignkey')
    op.drop_column('access_token', 'creator_id')


def downgrade() -> None:
    op.add_column('access_token', sa.Column('creator_id', postgresql.UUID(), autoincrement=False, nullable=True))
    op.create_foreign_key('access_token_creator_id_fkey', 'access_token', 'user', ['creator_id'], ['id'])
