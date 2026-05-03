import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings
import threading

def send_email_async(to_email: str, subject: str, body: str):
    """
    Sends an email using SMTP in a separate thread.
    """
    def send():
        try:
            msg = MIMEMultipart()
            msg['From'] = f"{settings.APP_NAME} <{settings.SMTP_2_FROM_EMAIL}>"
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(body, 'html'))

            with smtplib.SMTP(settings.SMTP_2_HOST, settings.SMTP_2_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_2_USER, settings.SMTP_2_PASSWORD)
                server.send_message(msg)
            
            print(f"[{datetime.datetime.now()}] [EMAIL SENT] To: {to_email} Subject: {subject}")
        except Exception as e:
            print(f"[{datetime.datetime.now()}] [EMAIL ERROR] Failed to send email to {to_email}: {e}")

    thread = threading.Thread(target=send)
    thread.start()

def send_withdrawal_email(user_email: str, amount: float, coin_symbol: str):
    subject = "Withdrawal Request Processing"
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Withdrawal Received</h2>
        <p>Dear user,</p>
        <p>Your withdrawal request for <strong>{amount} {coin_symbol}</strong> has been received and is currently under processing.</p>
        <p>Our admin team will review it shortly. You will be notified once it is approved.</p>
        <p>Thank you for using {settings.SMTP_2_COMPANY_NAME}.</p>
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
