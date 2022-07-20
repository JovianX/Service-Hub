"""
Added Template model.

Revision ID: 7409ad328910
Revises: 9f942894508f
Create Date: 2022-07-20 15:39:18.519627
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7409ad328910'
down_revision = '9f942894508f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'template',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('creator_id', postgresql.UUID(), nullable=False),
        sa.Column('default_revision_id', sa.Integer(), nullable=True),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['default_revision_id'], ['manifest_revision.id'], use_alter=True),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('organization_id', 'name', name='_organization_name_uc')
    )
    op.create_index(op.f('ix_template_id'), 'template', ['id'], unique=False)
    op.create_table(
        'manifest_revision',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('revision', sa.Integer(), nullable=False),
        sa.Column('raw_manifest', sa.Text(), nullable=False),
        sa.Column('manifest', sa.JSON(), nullable=False),
        sa.Column('comment', sa.String(), nullable=False),
        sa.Column('template_id', sa.Integer(), nullable=False),
        sa.Column('creator_id', postgresql.UUID(), nullable=False),
        sa.CheckConstraint('revision > 0', name='_revision_greater_than_zero_c'),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['template_id'], ['template.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_manifest_revision_id'), 'manifest_revision', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_manifest_revision_id'), table_name='manifest_revision')
    op.drop_table('manifest_revision')
    op.drop_index(op.f('ix_template_id'), table_name='template')
    op.drop_table('template')
