"""
Added health field to application model.

Revision ID: 0352dfbeafae
Revises: b45f1fcb3840
Create Date: 2022-10-26 13:32:36.548426
"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '0352dfbeafae'
down_revision = 'b45f1fcb3840'
branch_labels = None
depends_on = None


def upgrade() -> None:
    statuses = sa.Enum('healthy', 'unhealthy', name='application_health_statuses')
    statuses.create(op.get_bind(), checkfirst=True)
    op.add_column('application', sa.Column('health', statuses, nullable=True))

    op.execute("UPDATE application SET health = 'healthy'")

    op.alter_column('application', 'health', existing_type=statuses, nullable=False)


def downgrade() -> None:
    op.drop_column('application', 'health')
    statuses = sa.Enum('healthy', 'unhealthy', name='application_health_statuses')
    statuses.drop(op.get_bind())
