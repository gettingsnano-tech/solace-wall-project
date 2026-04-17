from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Numeric, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class TransactionType(str, enum.Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"

class Status(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    wallets = relationship("UserWallet", back_populates="user")
    balances = relationship("Balance", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    withdrawal_requests = relationship("WithdrawalRequest", back_populates="user")

class Coin(Base):
    __tablename__ = "coins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    symbol = Column(String, unique=True)
    icon_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    wallet_addresses = relationship("WalletAddress", back_populates="coin")
    user_wallets = relationship("UserWallet", back_populates="coin")
    balances = relationship("Balance", back_populates="coin")
    transactions = relationship("Transaction", back_populates="coin")

class WalletAddress(Base):
    __tablename__ = "wallet_addresses"
    id = Column(Integer, primary_key=True, index=True)
    coin_id = Column(Integer, ForeignKey("coins.id"))
    network = Column(String)
    address = Column(String, unique=True)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    coin = relationship("Coin", back_populates="wallet_addresses")
    user_wallet = relationship("UserWallet", back_populates="address")

class UserWallet(Base):
    __tablename__ = "user_wallets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    coin_id = Column(Integer, ForeignKey("coins.id"))
    address_id = Column(Integer, ForeignKey("wallet_addresses.id"))
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="wallets")
    coin = relationship("Coin", back_populates="user_wallets")
    address = relationship("WalletAddress", back_populates="user_wallet")

class Balance(Base):
    __tablename__ = "balances"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    coin_id = Column(Integer, ForeignKey("coins.id"))
    amount = Column(Numeric(precision=20, scale=8), default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="balances")
    coin = relationship("Coin", back_populates="balances")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    coin_id = Column(Integer, ForeignKey("coins.id"))
    type = Column(String)  # deposit, withdrawal
    amount = Column(Numeric(precision=20, scale=8))
    network = Column(String)
    to_address = Column(String, nullable=True)
    from_address = Column(String, nullable=True)
    status = Column(String, default=Status.PENDING)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(String, nullable=True)
    tx_hash = Column(String, nullable=True)

    user = relationship("User", back_populates="transactions")
    coin = relationship("Coin", back_populates="transactions")

class WithdrawalRequest(Base):
    __tablename__ = "withdrawal_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    coin_id = Column(Integer, ForeignKey("coins.id"))
    network = Column(String)
    to_address = Column(String)
    amount = Column(Numeric(precision=20, scale=8))
    status = Column(String, default=Status.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", back_populates="withdrawal_requests")
