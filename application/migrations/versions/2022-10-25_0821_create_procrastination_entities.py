"""
Create Procrastination entities.

Revision ID: b45f1fcb3840
Revises: c5f94e6d60ea
Create Date: 2022-10-25 08:21:01.902682
"""
import subprocess
import os

# revision identifiers, used by Alembic.
revision = 'b45f1fcb3840'
down_revision = 'c5f94e6d60ea'
branch_labels = None
depends_on = None


def upgrade() -> None:
    system_environment = os.environ.copy()
    response = subprocess.run(
        ['procrastinate', '--app=services.procrastinate.application.procrastinate', 'schema', '--apply'],
        stderr=subprocess.PIPE,
        stdout=subprocess.PIPE,
        env={**system_environment, **{'PYTHONPATH': '.'}}
    )
    if response.returncode != 0:
        error_message = response.stderr.decode()
        if 'already exists' in error_message:
            # It seems we trying to recreate existing Procrastinate DB entities.
            return
        raise RuntimeError(response.stderr.decode())


def downgrade() -> None:
    pass
