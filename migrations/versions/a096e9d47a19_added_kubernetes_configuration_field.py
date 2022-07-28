"""
Added kubernetes_configuration field to Organization model.

Revision ID: a096e9d47a19
Revises: 16f391d42b67
Create Date: 2022-07-07 13:26:20.916646
"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = 'a096e9d47a19'
down_revision = '16f391d42b67'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'organization',
        sa.Column(
            'kubernetes_configuration',
            sa.JSON(),
            nullable=False,
            server_default='{"configuration": {}, "metadata": {}}'
        )
    )


def downgrade() -> None:
    op.drop_column('organization', 'kubernetes_configuration')
