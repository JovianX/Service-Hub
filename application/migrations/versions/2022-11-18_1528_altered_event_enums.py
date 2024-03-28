"""
Altered event enums.

Revision ID: 488fbe744acd
Revises: e8700095ac3e
Create Date: 2022-11-16 15:28:18.096036
"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '488fbe744acd'
down_revision = 'e8700095ac3e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TYPE event_categories RENAME VALUE 'release' TO 'helm'")
    op.execute("ALTER TYPE event_severity_levels RENAME VALUE 'critical' TO 'warning'")


def downgrade() -> None:
    op.execute("ALTER TYPE event_categories RENAME VALUE 'helm' TO 'release'")
    op.execute("ALTER TYPE event_severity_levels RENAME VALUE 'warning' TO 'critical'")
