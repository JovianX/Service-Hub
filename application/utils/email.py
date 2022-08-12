"""
E-mail related helpers.
"""
from email.message import EmailMessage

import aiosmtplib

from core.configuration import settings


async def send_email(
    to: str | list[str], subject: str, message: str, cc: str | list[str] | None = None,
    bcc: str | list[str] | None = None
) -> None:
    """
    Forms up and sends E-mail.
    """
    email_message = EmailMessage()
    email_message['From'] = settings.EMAIL_SENDER
    email_message['To'] = to if isinstance(to, str) else ', '.join(to)
    email_message['Subject'] = subject
    if cc:
        email_message['Cc'] = cc if isinstance(cc, str) else ', '.join(cc)
    if bcc:
        email_message['Bcc'] = bcc if isinstance(bcc, str) else ', '.join(bcc)
    email_message.set_content(message)

    await aiosmtplib.send(
        email_message,
        hostname=settings.EMAIL_SMTP_HOST,
        port=settings.EMAIL_SMTP_PORT,
        username=settings.EMAIL_SMTP_LOGIN,
        password=settings.EMAIL_SMTP_PASSWORD,
        use_tls=True
    )
