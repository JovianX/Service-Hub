"""
Added Application model.

Revision ID: 0f2048662cbf
Revises: a30521cd80ca
Create Date: 2022-07-26 16:47:49.683652
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '0f2048662cbf'
down_revision = 'a30521cd80ca'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'application',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('manifest', sa.Text(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
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
