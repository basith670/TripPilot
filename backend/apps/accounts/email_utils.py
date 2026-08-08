import resend

from django.conf import settings


resend.api_key = settings.RESEND_API_KEY


def send_password_reset_email(
    email: str,
    first_name: str,
    reset_link: str,
):
    resend.Emails.send(
        {
            "from": "TripPilot <onboarding@resend.dev>",
            "to": [email],
            "subject": "Reset your TripPilot password",
            "html": f"""
            <div style="font-family:Arial;padding:40px">

                <h2>Reset Password</h2>

                <p>Hi {first_name},</p>

                <p>
                    You requested a password reset for your
                    TripPilot account.
                </p>

                <p>
                    <a
                        href="{reset_link}"
                        style="
                            background:#2563eb;
                            color:white;
                            padding:12px 24px;
                            text-decoration:none;
                            border-radius:8px;
                            display:inline-block;
                        "
                    >
                        Reset Password
                    </a>
                </p>

                <p>
                    If you didn't request this,
                    you can ignore this email.
                </p>

                <hr>

                <p>
                    TripPilot AI Travel Planner
                </p>

            </div>
            """,
        }
    )