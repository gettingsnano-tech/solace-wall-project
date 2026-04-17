from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class CoinBase(BaseModel):
    name: str
    symbol: str
    icon_url: Optional[str] = None

class CoinCreate(CoinBase):
    pass

class CoinResponse(CoinBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class WalletAddressBase(BaseModel):
    coin_id: int
    network: str
    address: str

class WalletAddressCreate(WalletAddressBase):
    pass

class WalletAddressResponse(WalletAddressBase):
    id: int
    is_used: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BalanceResponse(BaseModel):
    coin: CoinResponse
    amount: Decimal
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TransactionResponse(BaseModel):
    id: int
    type: str
    amount: Decimal
    network: str
    to_address: Optional[str]
    from_address: Optional[str]
    status: str
    timestamp: datetime
    tx_hash: Optional[str]
    coin: CoinResponse
    model_config = ConfigDict(from_attributes=True)

class WithdrawalRequestCreate(BaseModel):
    coin_id: int
    network: str
    to_address: str
    amount: Decimal

class WithdrawalRequestResponse(BaseModel):
    id: int
    coin: CoinResponse
    network: str
    to_address: str
    amount: Decimal
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TopUpRequest(BaseModel):
    user_id: int
    coin_id: int
    amount: Decimal
    notes: Optional[str] = None

class MarketCoin(BaseModel):
    id: str
    name: str
    symbol: str
    current_price: float
    price_change_percentage_24h: float
    market_cap: float
    total_volume: float
    image: str
