"""
Added TemplateRevision model.

Revision ID: a30521cd80ca
Revises: 9f942894508f
Create Date: 2022-07-22 12:17:22.610048
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a30521cd80ca'
down_revision = '9f942894508f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'template_revision',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('revision', sa.Integer(), nullable=False),
        sa.Column('template', sa.Text(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('default', sa.Boolean(), nullable=False),
        sa.Column('creator_id', postgresql.UUID(), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('revision > 0', name='_revision_greater_than_zero_c'),
        sa.UniqueConstraint('organization_id', 'name', 'revision', name='_organization_name_uc')
    )
    op.create_index(op.f('ix_template_revision_id'), 'template_revision', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_template_revision_id'), table_name='template_revision')
    op.drop_table('template_revision')
