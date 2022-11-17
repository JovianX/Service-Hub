"""
Altered event enums.

Revision ID: 488fbe744acd
Revises: f6ed2d61f1fb
Create Date: 2022-11-16 15:28:18.096036
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql
from constants.events import EventCategory
from constants.events import EventSeverityLevel

# revision identifiers, used by Alembic.
revision = '488fbe744acd'
down_revision = 'f6ed2d61f1fb'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TYPE event_categories RENAME VALUE 'release' TO 'helm'")
    op.execute("ALTER TYPE event_severity_levels RENAME VALUE 'critical' TO 'warning'")


def downgrade() -> None:
    op.execute("ALTER TYPE event_categories RENAME VALUE 'helm' TO 'release'")
    op.execute("ALTER TYPE event_severity_levels RENAME VALUE 'warning' TO 'critical'")
