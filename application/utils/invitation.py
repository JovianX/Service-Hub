"""
Invitations related helpers.
"""
from datetime import datetime
from datetime import timedelta


def is_invitation_expired(created_at: datetime, expiration_period: int) -> bool:
    """
    Returns `True` if invitation is expired.
    """
    if expiration_period == 0:
        # Period equal to zero means that invitation can be active unlimited
        # time.
        return False

    now = datetime.now()
    expiration_date = created_at + timedelta(hours=expiration_period)

    return expiration_date <= now
