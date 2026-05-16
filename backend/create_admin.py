import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
import random
import string

# Setup DB connection
SQLALCHEMY_DATABASE_URL = "sqlite:///core_capital.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def generate_password(length=12):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def create_admin():
    db = SessionLocal()
    from models import User
    
    email = "support@capitaltx.com"
    password = generate_password()
    
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        existing_user.role = "admin"
        existing_user.is_verified = True
        existing_user.hashed_password = get_password_hash(password)
        print(f"Updated existing user {email} to admin.")
    else:
        new_admin = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name="Capital TX Support",
            role="admin",
            is_active=True,
            is_verified=True
        )
        db.add(new_admin)
        print(f"Created new admin {email}.")
    
    db.commit()
    print(f"Password for {email}: {password}")

if __name__ == "__main__":
    create_admin()
