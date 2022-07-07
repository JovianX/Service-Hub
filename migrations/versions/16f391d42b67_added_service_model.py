"""Added Service model

Revision ID: 16f391d42b67
Revises: 003aa70bf346
Create Date: 2022-07-01 19:36:10.109403

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '16f391d42b67'
down_revision = '003aa70bf346'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'service',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('health_check_settings', sa.JSON(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('creator_id', postgresql.UUID(), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_service_id'), 'service', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_service_id'), table_name='service')
    op.drop_table('service')
