from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
import utils.auth
from utils.auth import create_access_token, get_password_hash, verify_password, decode_access_token
from utils.email import send_verification_email, send_login_email, send_password_reset_email
from datetime import timedelta
import secrets
import re
from config import settings
from dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")
    if not re.search(r"\d", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one digit")

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password strength
    validate_password(user.password)
    
    verification_token = secrets.token_urlsafe(32)
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        verification_token=verification_token,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send verification email
    send_verification_email(new_user.email, verification_token)
    
    return new_user

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    user.is_verified = True
    user.verification_token = None
    db.commit()
    return {"message": "Email verified successfully. You can now log in."}

@router.post("/login", response_model=schemas.LoginResponse)
def login(request: Request, response: Response, user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    # Note: Using UserCreate schema for login (email/password), we can refine this
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # if not user.is_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Email not verified. Please check your inbox."
    #     )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    # Add login notification
    notification = models.Notification(
        user_id=user.id,
        type="login",
        message="New login detected for your account."
    )
    db.add(notification)
    db.commit()

    # Send login email if enabled
    if user.email_notif_login:
        from datetime import datetime
        send_login_email(user.email, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), request.client.host)
    
    # Set httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=settings.access_token_expire_seconds,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE
    )
    
    return {"message": "Logged in successfully", "role": user.role, "is_verified": user.is_verified}

@router.post("/resend-verification")
def resend_verification(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.is_verified:
        return {"message": "Email already verified"}
    
    # Refresh token
    verification_token = secrets.token_urlsafe(32)
    current_user.verification_token = verification_token
    db.commit()
    
    send_verification_email(current_user.email, verification_token)
    return {"message": "Verification email resent successfully"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}

@router.post("/forgot-password")
def forgot_password(request_data: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request_data.email).first()
    if not user:
        # Don't reveal that the user does not exist
        return {"message": "If an account exists with this email, a password reset link has been sent."}
    
    # Create reset token (valid for 30 minutes)
    reset_token = create_access_token(
        data={"sub": user.email, "type": "reset_password"},
        expires_delta=timedelta(minutes=30)
    )
    
    send_password_reset_email(user.email, reset_token)
    return {"message": "If an account exists with this email, a password reset link has been sent."}

@router.post("/reset-password")
def reset_password(request_data: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    payload = decode_access_token(request_data.token)
    if not payload or payload.get("type") != "reset_password":
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    email = payload.get("sub")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate new password
    validate_password(request_data.new_password)
    
    # Update password
    user.hashed_password = get_password_hash(request_data.new_password)
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
