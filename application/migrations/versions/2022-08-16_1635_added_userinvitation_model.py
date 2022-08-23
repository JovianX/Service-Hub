"""
Added UserInvitation model.

Revision ID: bf6e28a49ebb
Revises: e6b3278e8d3c
Create Date: 2022-08-16 16:35:37.376779
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'bf6e28a49ebb'
down_revision = 'e6b3278e8d3c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'user_invitation',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('expiration_period', sa.Integer(), nullable=False),
        sa.Column('email_sent_at', sa.DateTime(), nullable=True),
        sa.Column('created_user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('creator_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.CheckConstraint('expiration_period >= 0', name='_expiration_period_greater_than_zero_c'),
        sa.ForeignKeyConstraint(['created_user_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_invitation_id'), 'user_invitation', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_invitation_id'), table_name='user_invitation')
    op.drop_table('user_invitation')
