"""
Added user access token model.

Revision ID: 288af7dbc2d6
Revises: 17ba98259c52
Create Date: 2022-12-21 16:41:18.668676
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '288af7dbc2d6'
down_revision = '17ba98259c52'
branch_labels = None
depends_on = None


def upgrade() -> None:
    statuses = sa.Enum('active', 'disabled', name='access_token_statuses')
    op.create_table(
        'access_token',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('status', statuses, nullable=False),
        sa.Column('expiration_date', sa.DateTime(), nullable=True),
        sa.Column('comment', sa.String(), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('creator_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_access_token_id'), 'access_token', ['id'], unique=False)
    op.create_index(op.f('ix_event_id'), 'event', ['id'], unique=False)
    op.execute("ALTER TYPE event_categories ADD VALUE IF NOT EXISTS 'access_token'")


def downgrade() -> None:
    op.drop_index(op.f('ix_event_id'), table_name='event')
    op.drop_index(op.f('ix_access_token_id'), table_name='access_token')
    op.drop_table('access_token')
    statuses = sa.Enum('active', 'disabled', name='access_token_statuses')
    statuses.drop(op.get_bind())
