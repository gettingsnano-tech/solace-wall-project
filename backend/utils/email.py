import datetime
from config import settings

def send_withdrawal_email(user_email: str, amount: float, coin_symbol: str):
    """
    Simulates sending an email to the user about their pending withdrawal request.
    Uses configured SMTP settings for metadata.
    """
    print(f"[{datetime.datetime.now()}] [EMAIL SERVICE - {settings.SMTP_2_COMPANY_NAME}]")
    print(f"From: {settings.SMTP_2_FROM_EMAIL}")
    print(f"To: {user_email}")
    print("Subject: Withdrawal Request Processing")
    print("Body:")
    print(f"Dear user,")
    print(f"Your withdrawal request for {amount} {coin_symbol} has been received and is currently under processing.")
    print("Our admin team will review it shortly. You will be notified once it is approved.")
    print(f"Thank you for using {settings.SMTP_2_COMPANY_NAME}.")
    print("-" * 50)

def send_verification_email(user_email: str, token: str):
    """
    Simulates sending a verification email to the user.
    """
    # In a real app, this would be the frontend URL
    verification_link = f"{settings.FRONTEND_URL}/auth/verify-email?token={token}"
    print(f"[{datetime.datetime.now()}] [EMAIL SERVICE - {settings.SMTP_2_COMPANY_NAME}]")
    print(f"From: {settings.SMTP_2_FROM_EMAIL}")
    print(f"To: {user_email}")
    print("Subject: Verify Your Email Address")
    print("Body:")
    print(f"Dear user,")
    print(f"Please verify your email address by clicking the link below:")
    print(f"{verification_link}")
    print("If you did not create an account, please ignore this email.")
    print(f"Thank you for using {settings.SMTP_2_COMPANY_NAME}.")
    print("-" * 50)
