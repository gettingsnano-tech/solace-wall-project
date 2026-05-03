from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from dependencies import get_current_user, get_verified_user
from typing import List, Optional
from datetime import datetime
from utils.email import send_withdrawal_email
import pyotp
from config import settings

router = APIRouter(prefix="/api/user", tags=["user"])

# ─── Coins ────────────────────────────────────────────────────────────────────

@router.get("/coins", response_model=List[schemas.CoinResponse])
def get_user_coins(db: Session = Depends(get_db)):
    return db.query(models.Coin).filter(models.Coin.is_active == True).all()

@router.get("/coins/{coin_id}/networks", response_model=List[schemas.CoinNetworkResponse])
def get_coin_networks(coin_id: int, db: Session = Depends(get_db)):
    """Return active networks for a specific coin."""
    return (
        db.query(models.CoinNetwork)
        .filter(models.CoinNetwork.coin_id == coin_id, models.CoinNetwork.is_active == True)
        .all()
    )

# ─── Wallets ──────────────────────────────────────────────────────────────────

@router.get("/wallets", response_model=List[schemas.UserWalletResponse])
def get_user_wallets(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    """Return all coin+network deposit addresses assigned to this user."""
    return db.query(models.UserWallet).filter(models.UserWallet.user_id == user.id).all()

@router.post("/wallets/generate", response_model=schemas.UserWalletResponse)
def generate_wallet(coin_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    """Legacy single-coin wallet generation (no network filter). Kept for backward compat."""
    existing = db.query(models.UserWallet).filter(
        models.UserWallet.user_id == user.id,
        models.UserWallet.coin_id == coin_id
    ).first()
    if existing:
        return existing
    
    address = db.query(models.WalletAddress).filter(
        models.WalletAddress.coin_id == coin_id,
        models.WalletAddress.is_used == False
    ).first()
    
    if not address:
        raise HTTPException(status_code=404, detail="No available addresses for this coin. Please contact support.")
    
    address.is_used = True
    user_wallet = models.UserWallet(user_id=user.id, coin_id=coin_id, address_id=address.id)
    db.add(user_wallet)
    db.commit()
    db.refresh(user_wallet)
    return user_wallet

# ─── Deposit Address (idempotent) ─────────────────────────────────────────────

@router.get("/deposit/address", response_model=schemas.DepositAddressResponse)
def get_deposit_address(
    coin_id: int,
    network: str,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """
    Idempotent deposit address assignment.
    - If user already has an address for coin+network → return it.
    - Otherwise pull the next available address from the pool and assign it.
    - Returns 503 if the pool is exhausted.
    """
    # Check for existing assignment
    existing = db.query(models.UserWallet).filter(
        models.UserWallet.user_id == user.id,
        models.UserWallet.coin_id == coin_id,
        models.UserWallet.network == network
    ).first()

    if existing:
        coin = db.query(models.Coin).filter(models.Coin.id == coin_id).first()
        return schemas.DepositAddressResponse(
            address=existing.address.address,
            network=existing.network,
            coin=coin
        )

    # Assign a new address from the pool
    address = db.query(models.WalletAddress).filter(
        models.WalletAddress.coin_id == coin_id,
        models.WalletAddress.network == network,
        models.WalletAddress.is_used == False
    ).first()

    if not address:
        raise HTTPException(
            status_code=503,
            detail="No addresses available for this coin/network. Please contact support."
        )

    address.is_used = True
    user_wallet = models.UserWallet(
        user_id=user.id,
        coin_id=coin_id,
        address_id=address.id,
        network=network
    )
    db.add(user_wallet)
    db.commit()
    db.refresh(address)

    coin = db.query(models.Coin).filter(models.Coin.id == coin_id).first()
    return schemas.DepositAddressResponse(
        address=address.address,
        network=network,
        coin=coin
    )

# ─── Balances & Transactions ──────────────────────────────────────────────────

@router.get("/balances", response_model=List[schemas.BalanceResponse])
def get_user_balances(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    balances = db.query(models.Balance).filter(models.Balance.user_id == user.id).all()
    return balances

@router.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_user_transactions(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Transaction).filter(models.Transaction.user_id == user.id).order_by(models.Transaction.timestamp.desc()).all()

# ─── Withdrawals ──────────────────────────────────────────────────────────────

@router.post("/withdraw")
def request_withdrawal(request: schemas.WithdrawalRequestCreate, db: Session = Depends(get_db), user: models.User = Depends(get_verified_user)):
    # Validate balance
    balance = db.query(models.Balance).filter(
        models.Balance.user_id == user.id,
        models.Balance.coin_id == request.coin_id
    ).first()
    
    if not balance or balance.amount < request.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create request
    new_request = models.WithdrawalRequest(
        user_id=user.id,
        coin_id=request.coin_id,
        network=request.network,
        to_address=request.to_address,
        amount=request.amount,
        status="pending"
    )
    db.add(new_request)
    # Get coin info for the email
    coin = db.query(models.Coin).filter(models.Coin.id == request.coin_id).first()
    coin_symbol = coin.symbol if coin else "Unknown"

    # Create notification
    notification = models.Notification(
        user_id=user.id,
        type="withdrawal",
        message=f"Withdrawal request for {request.amount} {coin_symbol} has been received and is under processing."
    )
    db.add(notification)
    db.commit()

    # Send email if notification is enabled
    if user.email_notif_withdrawal:
        send_withdrawal_email(user.email, float(request.amount), coin_symbol)

    return {"message": "Withdrawal request submitted for approval. An email has been sent to you."}

# ─── Settings & Security ──────────────────────────────────────────────────────

@router.get("/settings", response_model=schemas.UserSettingsResponse)
def get_user_settings(user: models.User = Depends(get_current_user)):
    return user

@router.put("/settings", response_model=schemas.UserSettingsResponse)
def update_user_settings(
    settings: schemas.UserSettingsUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    if settings.email_notif_login is not None:
        user.email_notif_login = settings.email_notif_login
    if settings.email_notif_deposit is not None:
        user.email_notif_deposit = settings.email_notif_deposit
    if settings.email_notif_withdrawal is not None:
        user.email_notif_withdrawal = settings.email_notif_withdrawal
    
    db.commit()
    db.refresh(user)
    return user

@router.post("/2fa/generate", response_model=schemas.Enable2FAResponse)
def generate_2fa_secret(db: Session = Depends(get_db), user: models.User = Depends(get_verified_user)):
    if user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="2FA is already enabled")
    
    secret = pyotp.random_base32()
    user.two_factor_secret = secret
    db.commit()
    
    # Generate QR URI
    qr_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=user.email, issuer_name=settings.ISSUER_NAME)
    
    return {"secret": secret, "qr_uri": qr_uri}

@router.post("/2fa/verify")
def verify_and_enable_2fa(
    request: schemas.Verify2FARequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_verified_user)
):
    if not user.two_factor_secret:
        raise HTTPException(status_code=400, detail="2FA secret not generated yet")
    
    totp = pyotp.TOTP(user.two_factor_secret)
    if not totp.verify(request.token):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")
    
    user.two_factor_enabled = True
    
    # Add notification
    notification = models.Notification(
        user_id=user.id,
        type="security",
        message="Two-Factor Authentication (2FA) was successfully enabled."
    )
    db.add(notification)
    
    db.commit()
    return {"message": "2FA successfully enabled"}

@router.post("/2fa/disable")
def disable_2fa(
    request: schemas.Verify2FARequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_verified_user)
):
    if not user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="2FA is not enabled")
    
    totp = pyotp.TOTP(user.two_factor_secret)
    if not totp.verify(request.token):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")
    
    user.two_factor_enabled = False
    user.two_factor_secret = None
    
    # Add notification
    notification = models.Notification(
        user_id=user.id,
        type="security",
        message="Two-Factor Authentication (2FA) was successfully disabled."
    )
    db.add(notification)
    
    db.commit()
    return {"message": "2FA successfully disabled"}

# ─── Notifications ────────────────────────────────────────────────────────────

@router.get("/notifications", response_model=List[schemas.NotificationResponse])
def get_user_notifications(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Notification).filter(models.Notification.user_id == user.id).order_by(models.Notification.created_at.desc()).all()

@router.put("/notifications/{notif_id}/read")
def mark_notification_read(
    notif_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notif_id,
        models.Notification.user_id == user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

# ─── Swap ────────────────────────────────────────────────────────────────────
from utils.market import get_coin_price_usd
from decimal import Decimal

@router.post("/swap/preview", response_model=schemas.SwapPreview)
async def preview_swap(request: schemas.SwapRequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    from_coin = db.query(models.Coin).filter(models.Coin.id == request.from_coin_id).first()
    to_coin = db.query(models.Coin).filter(models.Coin.id == request.to_coin_id).first()
    
    if not from_coin or not to_coin:
        raise HTTPException(status_code=404, detail="Coin not found")
    
    # Logic: Any -> USDT or USDT -> Any
    if from_coin.symbol.upper() != "USDT" and to_coin.symbol.upper() != "USDT":
         raise HTTPException(status_code=400, detail="One of the coins must be USDT")

    from_price = await get_coin_price_usd(from_coin.symbol)
    to_price = await get_coin_price_usd(to_coin.symbol)
    
    # USD value of source amount
    usd_value = float(request.amount) * from_price
    
    # Deduct $3 fee
    usd_after_fee = usd_value - 3.0
    if usd_after_fee < 0:
        usd_after_fee = 0
        
    # Amount in target coin
    target_amount = usd_after_fee / to_price
    
    return {
        "from_coin_id": from_coin.id,
        "to_coin_id": to_coin.id,
        "amount": request.amount,
        "estimated_receive": Decimal(str(round(target_amount, 8))),
        "fee_usd": Decimal("3.00"),
        "rate": from_price / to_price
    }

@router.post("/swap", response_model=schemas.SwapResponse)
async def perform_swap(request: schemas.SwapRequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    from_coin = db.query(models.Coin).filter(models.Coin.id == request.from_coin_id).first()
    to_coin = db.query(models.Coin).filter(models.Coin.id == request.to_coin_id).first()
    
    if not from_coin or not to_coin:
        raise HTTPException(status_code=404, detail="Coin not found")
        
    # Logic: Any -> USDT or USDT -> Any
    if from_coin.symbol.upper() != "USDT" and to_coin.symbol.upper() != "USDT":
         raise HTTPException(status_code=400, detail="One of the coins must be USDT")

    # Check balance
    balance_from = db.query(models.Balance).filter(
        models.Balance.user_id == user.id,
        models.Balance.coin_id == from_coin.id
    ).first()
    
    if not balance_from or balance_from.amount < request.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
        
    # Calculate conversion
    from_price = await get_coin_price_usd(from_coin.symbol)
    to_price = await get_coin_price_usd(to_coin.symbol)
    
    usd_value = float(request.amount) * from_price
    usd_after_fee = usd_value - 3.0
    
    if usd_after_fee <= 0:
        raise HTTPException(status_code=400, detail="Amount too small to cover fee")
        
    target_amount = usd_after_fee / to_price
    target_amount_dec = Decimal(str(round(target_amount, 8)))

    # Deduct from source
    balance_from.amount -= request.amount
    
    # Add to target
    balance_to = db.query(models.Balance).filter(
        models.Balance.user_id == user.id,
        models.Balance.coin_id == to_coin.id
    ).first()
    
    if balance_to:
        balance_to.amount += target_amount_dec
    else:
        balance_to = models.Balance(user_id=user.id, coin_id=to_coin.id, amount=target_amount_dec)
        db.add(balance_to)
        
    # Record history
    history = models.SwapHistory(
        user_id=user.id,
        from_coin_id=from_coin.id,
        to_coin_id=to_coin.id,
        from_amount=request.amount,
        to_amount=target_amount_dec,
        fee_usd=Decimal("3.00"),
        status="completed"
    )
    db.add(history)
    
    # Find admin users for notification
    admins = db.query(models.User).filter(models.User.role == "admin").all()
    for admin in admins:
        notif = models.Notification(
            user_id=admin.id,
            type="swap",
            message=f"User {user.email} performed a swap: {request.amount} {from_coin.symbol} → {target_amount_dec} {to_coin.symbol} (Fee: $3.00 USD)"
        )
        db.add(notif)

    # User notification
    user_notif = models.Notification(
        user_id=user.id,
        type="swap",
        message=f"You successfully swapped {request.amount} {from_coin.symbol} for {target_amount_dec} {to_coin.symbol}. A fee of $3.00 USD was applied."
    )
    db.add(user_notif)

    db.commit()
    db.refresh(history)
    return history

@router.get("/swaps", response_model=List[schemas.SwapResponse])
def get_user_swaps(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.SwapHistory).filter(models.SwapHistory.user_id == user.id).order_by(models.SwapHistory.created_at.desc()).all()

