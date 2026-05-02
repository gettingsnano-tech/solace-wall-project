from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import List, Optional
from decimal import Decimal

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
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

class CoinNetworkBase(BaseModel):
    coin_id: int
    name: str
    label: str

class CoinNetworkCreate(BaseModel):
    """Body for POST /api/admin/coins/{coin_id}/networks — coin_id comes from URL."""
    name: str
    label: str

class CoinNetworkResponse(CoinNetworkBase):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class WalletAddressBase(BaseModel):
    coin_id: int
    network: str
    address: str

class WalletAddressCreate(WalletAddressBase):
    pass

class BulkWalletCreate(BaseModel):
    coin_id: int
    network: str
    addresses: List[str]

class WalletAddressResponse(WalletAddressBase):
    id: int
    is_used: bool
    created_at: datetime
    coin: Optional[CoinResponse] = None
    model_config = ConfigDict(from_attributes=True)

class UserWalletResponse(BaseModel):
    id: int
    coin: CoinResponse
    network: Optional[str] = None
    address: WalletAddressResponse
    model_config = ConfigDict(from_attributes=True)

class DepositAddressResponse(BaseModel):
    address: str
    network: str
    coin: CoinResponse
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

class UserSettingsResponse(BaseModel):
    two_factor_enabled: bool
    email_notif_login: bool
    email_notif_deposit: bool
    email_notif_withdrawal: bool
    model_config = ConfigDict(from_attributes=True)

class UserSettingsUpdate(BaseModel):
    email_notif_login: Optional[bool] = None
    email_notif_deposit: Optional[bool] = None
    email_notif_withdrawal: Optional[bool] = None

class NotificationResponse(BaseModel):
    id: int
    type: str
    message: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Enable2FAResponse(BaseModel):
    secret: str
    qr_uri: str

class Verify2FARequest(BaseModel):
    token: str
