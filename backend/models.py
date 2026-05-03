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
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String, nullable=True)
    
    email_notif_login = Column(Boolean, default=True)
    email_notif_deposit = Column(Boolean, default=True)
    email_notif_withdrawal = Column(Boolean, default=True)

    wallets = relationship("UserWallet", back_populates="user")
    balances = relationship("Balance", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    withdrawal_requests = relationship("WithdrawalRequest", back_populates="user", foreign_keys="WithdrawalRequest.user_id")
    notifications = relationship("Notification", back_populates="user")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String) # login, deposit, withdrawal, security
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Coin(Base):
    __tablename__ = "coins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    symbol = Column(String, unique=True)
    icon_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    networks = relationship("CoinNetwork", back_populates="coin")
    wallet_addresses = relationship("WalletAddress", back_populates="coin")
    user_wallets = relationship("UserWallet", back_populates="coin")
    balances = relationship("Balance", back_populates="coin")
    transactions = relationship("Transaction", back_populates="coin")

class CoinNetwork(Base):
    __tablename__ = "coin_networks"
    id = Column(Integer, primary_key=True, index=True)
    coin_id = Column(Integer, ForeignKey("coins.id"))
    name = Column(String) # e.g. "ERC-20"
    label = Column(String) # User-friendly label
    is_active = Column(Boolean, default=True)

    coin = relationship("Coin", back_populates="networks")

class WalletAddress(Base):
    __tablename__ = "wallet_addresses"
    id = Column(Integer, primary_key=True, index=True)
    coin_id = Column(Integer, ForeignKey("coins.id"))
    network = Column(String, nullable=False)
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
    network = Column(String, nullable=True) # Explicit network assignment
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

    user = relationship("User", back_populates="withdrawal_requests", foreign_keys=[user_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])

class PlatformSettings(Base):
    __tablename__ = "platform_settings"
    id = Column(Integer, primary_key=True, index=True)
    
    # Offsets for social proof
    users_offset = Column(Integer, default=0)
    assets_offset = Column(Numeric(precision=20, scale=2), default=0)
    withdrawals_offset = Column(Integer, default=0)
    deposits_offset = Column(Numeric(precision=20, scale=2), default=0)
    
    # Additional display stats
    uptime_display = Column(String, default="99.99%")
    encryption_display = Column(String, default="256-bit")
    
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Exchange(Base):
    __tablename__ = "exchanges"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    url = Column(String)
    icon_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SwapHistory(Base):
    __tablename__ = "swap_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    from_coin_id = Column(Integer, ForeignKey("coins.id"))
    to_coin_id = Column(Integer, ForeignKey("coins.id"))
    from_amount = Column(Numeric(precision=20, scale=8))
    to_amount = Column(Numeric(precision=20, scale=8))
    fee_usd = Column(Numeric(precision=20, scale=2), default=3.00)
    status = Column(String, default="completed") # completed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User")
    from_coin = relationship("Coin", foreign_keys=[from_coin_id])
    to_coin = relationship("Coin", foreign_keys=[to_coin_id])
