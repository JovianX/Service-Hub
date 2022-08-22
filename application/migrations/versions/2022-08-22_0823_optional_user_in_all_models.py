"""
Optional user in all models.

Revision ID: 49b259b4f68d
Revises: bf6e28a49ebb
Create Date: 2022-08-22 08:23:37.268280
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '49b259b4f68d'
down_revision = 'bf6e28a49ebb'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column('application', 'creator_id', existing_type=postgresql.UUID(), nullable=True)
    op.alter_column('rule', 'creator_id', existing_type=postgresql.UUID(), nullable=True)
    op.alter_column('service', 'creator_id', existing_type=postgresql.UUID(), nullable=True)
    op.alter_column('template_revision', 'creator_id', existing_type=postgresql.UUID(), nullable=True)
    op.alter_column('user_invitation', 'creator_id', existing_type=postgresql.UUID(), nullable=True)


def downgrade() -> None:
    op.alter_column('user_invitation', 'creator_id', existing_type=postgresql.UUID(), nullable=False)
    op.alter_column('template_revision', 'creator_id', existing_type=postgresql.UUID(), nullable=False)
    op.alter_column('service', 'creator_id', existing_type=postgresql.UUID(), nullable=False)
    op.alter_column('rule', 'creator_id', existing_type=postgresql.UUID(), nullable=False)
    op.alter_column('application', 'creator_id', existing_type=postgresql.UUID(), nullable=False)
