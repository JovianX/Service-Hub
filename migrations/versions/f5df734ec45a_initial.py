"""
Initial.

Revision ID: f5df734ec45a
Revises:
Create Date: 2022-06-08 17:38:08.950109
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'f5df734ec45a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'user',
        sa.Column('email', sa.VARCHAR(length=320), autoincrement=False, nullable=False),
        sa.Column('hashed_password', sa.VARCHAR(length=1024), autoincrement=False, nullable=False),
        sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column('is_superuser', sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column('is_verified', sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column('id', postgresql.UUID(), autoincrement=False, nullable=False),
        sa.PrimaryKeyConstraint('id', name='user_pkey'),
        postgresql_ignore_search_path=False
    )
    op.create_index('ix_user_email', 'user', ['email'], unique=False)
    op.create_table(
        'oauth_account',
        sa.Column('oauth_name', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
        sa.Column('access_token', sa.VARCHAR(length=1024), autoincrement=False, nullable=False),
        sa.Column('expires_at', sa.INTEGER(), autoincrement=False, nullable=True),
        sa.Column('refresh_token', sa.VARCHAR(length=1024), autoincrement=False, nullable=True),
        sa.Column('account_id', sa.VARCHAR(length=320), autoincrement=False, nullable=False),
        sa.Column('account_email', sa.VARCHAR(length=320), autoincrement=False, nullable=False),
        sa.Column('id', postgresql.UUID(), autoincrement=False, nullable=False),
        sa.Column('user_id', postgresql.UUID(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='oauth_account_user_id_fkey', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name='oauth_account_pkey')
    )
    op.create_index('ix_oauth_account_oauth_name', 'oauth_account', ['oauth_name'], unique=False)
    op.create_index('ix_oauth_account_account_id', 'oauth_account', ['account_id'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_oauth_account_account_id', table_name='oauth_account')
    op.drop_index('ix_oauth_account_oauth_name', table_name='oauth_account')
    op.drop_table('oauth_account')
    op.drop_index('ix_user_email', table_name='user')
    op.drop_table('user')
