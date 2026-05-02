import datetime

def send_withdrawal_email(user_email: str, amount: float, coin_symbol: str):
    """
    Simulates sending an email to the user about their pending withdrawal request.
    In a real-world scenario, this would integrate with an SMTP server or an email service provider like SendGrid or AWS SES.
    """
    print(f"[{datetime.datetime.now()}] [EMAIL SERVICE]")
    print(f"To: {user_email}")
    print("Subject: Withdrawal Request Processing")
    print("Body:")
    print(f"Dear user,")
    print(f"Your withdrawal request for {amount} {coin_symbol} has been received and is currently under processing.")
    print("Our admin team will review it shortly. You will be notified once it is approved.")
    print("Thank you for using Solace.")
    print("-" * 50)
