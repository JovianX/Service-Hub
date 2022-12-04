"""
Added Event model.

Revision ID: f6ed2d61f1fb
Revises: 0352dfbeafae
Create Date: 2022-11-15 10:28:44.572461
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from constants.events import EventCategory
from constants.events import EventSeverityLevel


# revision identifiers, used by Alembic.
revision = 'f6ed2d61f1fb'
down_revision = '0352dfbeafae'
branch_labels = None
depends_on = None


def upgrade() -> None:
    event_categories = postgresql.ENUM(EventCategory, name='event_categories')
    event_severity_levels = postgresql.ENUM(EventSeverityLevel, name='event_severity_levels')
    op.create_table(
        'event',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('message', sa.String(), nullable=False),
        sa.Column('category', event_categories, nullable=False),
        sa.Column('severity', event_severity_levels, nullable=False),
        sa.Column('data', sa.JSON(), nullable=False),
        sa.Column('organization_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('event')
    event_categories = postgresql.ENUM(EventCategory, name='event_categories')
    event_categories.drop(op.get_bind())
    event_severity_levels = postgresql.ENUM(EventSeverityLevel, name='event_severity_levels')
    event_severity_levels.drop(op.get_bind())
