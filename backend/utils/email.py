import datetime
import threading
import urllib.request
import urllib.error
import json
from config import settings

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

def send_email_async(to_email: str, subject: str, body: str):
    """
    Sends an email using the Brevo REST API in a separate thread.
    """
    def send():
        try:
            payload = json.dumps({
                "sender": {
                    "name": settings.SMTP_2_COMPANY_NAME,
                    "email": settings.SMTP_2_FROM_EMAIL,
                },
                "to": [{"email": to_email}],
                "subject": subject,
                "htmlContent": body,
            }).encode("utf-8")

            req = urllib.request.Request(
                BREVO_API_URL,
                data=payload,
                headers={
                    "api-key": settings.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                method="POST",
            )

            with urllib.request.urlopen(req) as response:
                status = response.status

            print(f"[{datetime.datetime.now()}] [EMAIL SENT] To: {to_email} Subject: {subject} Status: {status}")
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="replace")
            print(f"[{datetime.datetime.now()}] [EMAIL ERROR] Failed to send email to {to_email}: HTTP {e.code} {error_body}")
        except Exception as e:
            print(f"[{datetime.datetime.now()}] [EMAIL ERROR] Failed to send email to {to_email}: {e}")

    thread = threading.Thread(target=send)
    thread.start()

def send_withdrawal_email(user_email: str, amount: float, coin_symbol: str, to_address: str):
    subject = "Withdrawal Request Processing"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Withdrawal Received</h2>
        <p>Dear user,</p>
        <p>Your withdrawal request for <strong>{amount} {coin_symbol}</strong> has been received and is currently under processing.</p>
        <p><strong>Designated Wallet Address:</strong><br><code style="background: #f4f4f4; padding: 5px; border-radius: 4px; display: block; margin-top: 5px;">{to_address}</code></p>
        <p>Our admin team will review it shortly. You will be notified once it is approved.</p>
        <p>Thank you for using {settings.SMTP_2_COMPANY_NAME}.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
    """
    send_email_async(user_email, subject, body)

def send_withdrawal_approved_email(user_email: str, amount: float, coin_symbol: str, to_address: str):
    subject = "Withdrawal Approved & Processed"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #10b981;">Withdrawal Approved</h2>
        <p>Dear user,</p>
        <p>Great news! Your withdrawal request has been approved and the funds have been sent to your designated wallet.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Amount:</strong> {amount} {coin_symbol}</p>
            <p style="margin: 0;"><strong>Designated Wallet Address:</strong></p>
            <code style="background: #fff; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; display: block; margin-top: 5px; word-break: break-all;">{to_address}</code>
        </div>
        <p>The transaction should appear in your wallet shortly depending on the network congestion.</p>
        <p>Thank you for choosing {settings.SMTP_2_COMPANY_NAME}.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
    """
    send_email_async(user_email, subject, body)

def send_verification_email(user_email: str, token: str):
    verification_link = f"{settings.FRONTEND_URL}/auth/verify-email?token={token}"
    subject = "Verify Your Email Address"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Welcome to {settings.APP_NAME}!</h2>
        <p>Please verify your email address to activate your account by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">{verification_link}</p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Thank you for using {settings.SMTP_2_COMPANY_NAME}.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
    """
    send_email_async(user_email, subject, body)

def send_login_email(user_email: str, time: str, ip: str = "Unknown"):
    subject = "New Login Detected"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">New Login</h2>
        <p>Dear user,</p>
        <p>A new login was detected for your account at <strong>{time}</strong>.</p>
        <p>IP Address: <strong>{ip}</strong></p>
        <p>If this was not you, please secure your account immediately.</p>
        <p>Thank you for using {settings.SMTP_2_COMPANY_NAME}.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
    """
    send_email_async(user_email, subject, body)

def send_deposit_email(user_email: str, amount: float, coin_symbol: str):
    subject = "Deposit Credited Successfully"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Deposit Success</h2>
        <p>Dear user,</p>
        <p>Your deposit of <strong>{amount} {coin_symbol}</strong> has been successfully credited to your account.</p>
        <p>You can now see your updated balance in your dashboard.</p>
        <p>Thank you for using {settings.SMTP_2_COMPANY_NAME}.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
    """
    send_email_async(user_email, subject, body)

def send_password_reset_email(user_email: str, token: str):
    reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?token={token}"
    subject = "Reset Your Password"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="background-color: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">{reset_link}</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you for using {settings.SMTP_2_COMPANY_NAME}.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
    """
    send_email_async(user_email, subject, body)

def send_admin_withdrawal_alert_email(admin_email: str, user_email: str, amount: float, coin_symbol: str, to_address: str, network: str):
    subject = f"[ADMIN ALERT] New Withdrawal Request - {amount} {coin_symbol}"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; border-top: 4px solid #f59e0b;">
        <h2 style="color: #d97706;">New Withdrawal Pending Review</h2>
        <p>Dear Administrator,</p>
        <p>A new withdrawal request has been submitted by a user and requires your review.</p>
        <div style="background: #fdfbf7; padding: 20px; border-radius: 12px; border: 1px solid #fef3c7; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>User Email:</strong> {user_email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Amount:</strong> {amount} {coin_symbol}</p>
            <p style="margin: 0 0 10px 0;"><strong>Network:</strong> {network}</p>
            <p style="margin: 0;"><strong>Designated Wallet Address:</strong></p>
            <code style="background: #fff; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; display: block; margin-top: 5px; word-break: break-all;">{to_address}</code>
        </div>
        <p>Please log in to the admin dashboard at <a href="{settings.FRONTEND_URL}/admin/withdrawals">{settings.FRONTEND_URL}/admin/withdrawals</a> to approve or reject this request.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated administrative notification.</p>
    </div>
    """
    send_email_async(admin_email, subject, body)
