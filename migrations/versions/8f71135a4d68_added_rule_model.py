"""
Added Rule model.

Revision ID: 8f71135a4d68
Revises: a096e9d47a19
Create Date: 2022-07-09 15:03:06.620573
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '8f71135a4d68'
down_revision = 'a096e9d47a19'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'rule',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('condition_settings', sa.JSON(), nullable=False),
        sa.Column('action_settings', sa.JSON(), nullable=False),
        sa.Column('creator_id', postgresql.UUID(), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_rule_id'), 'rule', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_rule_id'), table_name='rule')
    op.drop_table('rule')
