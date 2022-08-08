"""
Added Application model.

Revision ID: 3dfe60487a48
Revises: 3e3db8879742
Create Date: 2022-07-28 16:37:43.237502
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '3dfe60487a48'
down_revision = '3e3db8879742'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'application',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('manifest', sa.Text(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('context_name', sa.String(), nullable=False),
        sa.Column('namespace', sa.String(), nullable=False),
        sa.Column('user_inputs', sa.JSON(), nullable=False),
        sa.Column('template_id', sa.Integer(), nullable=False),
        sa.Column('creator_id', postgresql.UUID(), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.ForeignKeyConstraint(['template_id'], ['template_revision.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_application_id'), 'application', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_application_id'), table_name='application')
    op.drop_table('application')
