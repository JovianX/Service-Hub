"""
Initial.

Revision ID: bdc49e043161
Revises:
Create Date: 2022-06-15 15:33:15.325242
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'bdc49e043161'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'organization',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_organization_id'), 'organization', ['id'], unique=False)
    op.create_table(
        'user',
        sa.Column('email', sa.String(length=320), nullable=False),
        sa.Column('hashed_password', sa.String(length=1024), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_superuser', sa.Boolean(), nullable=False),
        sa.Column('is_verified', sa.Boolean(), nullable=False),
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_table(
        'oauth_account',
        sa.Column('oauth_name', sa.String(length=100), nullable=False),
        sa.Column('access_token', sa.String(length=1024), nullable=False),
        sa.Column('expires_at', sa.Integer(), nullable=True),
        sa.Column('refresh_token', sa.String(length=1024), nullable=True),
        sa.Column('account_id', sa.String(length=320), nullable=False),
        sa.Column('account_email', sa.String(length=320), nullable=False),
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='cascade'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_oauth_account_account_id'), 'oauth_account', ['account_id'], unique=False)
    op.create_index(op.f('ix_oauth_account_oauth_name'), 'oauth_account', ['oauth_name'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_oauth_account_oauth_name'), table_name='oauth_account')
    op.drop_index(op.f('ix_oauth_account_account_id'), table_name='oauth_account')
    op.drop_table('oauth_account')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_organization_id'), table_name='organization')
    op.drop_table('organization')
