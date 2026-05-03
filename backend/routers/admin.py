from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from dependencies import get_admin_user
from utils.simulate import generate_tx_hash
import os
import shutil
from datetime import datetime
from typing import List, Optional
from config import settings

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_admin_user)])

UPLOAD_DIR = settings.UPLOAD_DIR
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# ─── Coins ───────────────────────────────────────────────────────────────────

@router.post("/coins", response_model=schemas.CoinResponse)
async def create_coin(
    name: str = Form(...),
    symbol: str = Form(...),
    icon: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    icon_url = None
    if icon:
        file_path = os.path.join(UPLOAD_DIR, f"{symbol}_{icon.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(icon.file, buffer)
        icon_url = f"/{settings.UPLOAD_DIR}/{symbol}_{icon.filename}"
    
    new_coin = models.Coin(name=name, symbol=symbol, icon_url=icon_url)
    db.add(new_coin)
    db.commit()
    db.refresh(new_coin)
    return new_coin

@router.get("/coins", response_model=List[schemas.CoinResponse])
def list_coins(db: Session = Depends(get_db)):
    return db.query(models.Coin).all()

# ─── Coin Networks ────────────────────────────────────────────────────────────

@router.post("/coins/{coin_id}/networks", response_model=schemas.CoinNetworkResponse)
def add_coin_network(coin_id: int, network: schemas.CoinNetworkCreate, db: Session = Depends(get_db)):
    coin = db.query(models.Coin).filter(models.Coin.id == coin_id).first()
    if not coin:
        raise HTTPException(status_code=404, detail="Coin not found")
    new_network = models.CoinNetwork(coin_id=coin_id, name=network.name, label=network.label)
    db.add(new_network)
    db.commit()
    db.refresh(new_network)
    return new_network

@router.get("/coins/{coin_id}/networks", response_model=List[schemas.CoinNetworkResponse])
def list_coin_networks(coin_id: int, db: Session = Depends(get_db)):
    return db.query(models.CoinNetwork).filter(models.CoinNetwork.coin_id == coin_id).all()

@router.delete("/networks/{network_id}")
def delete_coin_network(network_id: int, db: Session = Depends(get_db)):
    network = db.query(models.CoinNetwork).filter(models.CoinNetwork.id == network_id).first()
    if not network:
        raise HTTPException(status_code=404, detail="Network not found")
    db.delete(network)
    db.commit()
    return {"message": "Network removed"}

# ─── Wallet Addresses ─────────────────────────────────────────────────────────

@router.post("/wallets", response_model=schemas.WalletAddressResponse)
def create_wallet_address(wallet: schemas.WalletAddressCreate, db: Session = Depends(get_db)):
    new_address = models.WalletAddress(**wallet.model_dump())
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.post("/wallets/bulk", response_model=List[schemas.WalletAddressResponse])
def bulk_create_wallet_addresses(payload: schemas.BulkWalletCreate, db: Session = Depends(get_db)):
    created = []
    skipped = 0
    for addr in payload.addresses:
        addr = addr.strip()
        if not addr:
            continue
        # Skip duplicates
        exists = db.query(models.WalletAddress).filter(models.WalletAddress.address == addr).first()
        if exists:
            skipped += 1
            continue
        new_address = models.WalletAddress(
            coin_id=payload.coin_id,
            network=payload.network,
            address=addr
        )
        db.add(new_address)
        created.append(new_address)
    db.commit()
    for a in created:
        db.refresh(a)
    return created

@router.get("/wallets", response_model=List[schemas.WalletAddressResponse])
def list_wallets(
    coin_id: Optional[int] = None,
    network: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(models.WalletAddress)
    if coin_id:
        q = q.filter(models.WalletAddress.coin_id == coin_id)
    if network:
        q = q.filter(models.WalletAddress.network == network)
    return q.all()

@router.get("/wallets/stats")
def wallet_pool_stats(db: Session = Depends(get_db)):
    """Return pool availability stats grouped by coin + network."""
    from sqlalchemy import func
    rows = (
        db.query(
            models.WalletAddress.coin_id,
            models.WalletAddress.network,
            func.count(models.WalletAddress.id).label("total"),
            func.sum(
                models.WalletAddress.is_used.cast(models.WalletAddress.is_used.type.__class__)
            ).label("used"),
        )
        .group_by(models.WalletAddress.coin_id, models.WalletAddress.network)
        .all()
    )

    # Enrich with coin info
    coins = {c.id: c for c in db.query(models.Coin).all()}
    result = []
    for row in rows:
        coin = coins.get(row.coin_id)
        used = int(row.used or 0)
        total = int(row.total or 0)
        result.append({
            "coin_id": row.coin_id,
            "coin_name": coin.name if coin else f"#{row.coin_id}",
            "coin_symbol": coin.symbol if coin else "?",
            "network": row.network,
            "total": total,
            "used": used,
            "available": total - used,
        })
    return result

# ─── Users ────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[schemas.UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "user").all()

# ─── Top-up ───────────────────────────────────────────────────────────────────

@router.post("/topup")
def topup_user(topup: schemas.TopUpRequest, db: Session = Depends(get_db)):
    # Create transaction
    new_tx = models.Transaction(
        user_id=topup.user_id,
        coin_id=topup.coin_id,
        type="deposit",
        amount=topup.amount,
        network="System",
        status="approved",
        notes=topup.notes,
        tx_hash=generate_tx_hash()
    )
    db.add(new_tx)
    
    # Update balance
    balance = db.query(models.Balance).filter(
        models.Balance.user_id == topup.user_id,
        models.Balance.coin_id == topup.coin_id
    ).first()
    
    if balance:
        balance.amount += topup.amount
    else:
        balance = models.Balance(user_id=topup.user_id, coin_id=topup.coin_id, amount=topup.amount)
        db.add(balance)
    
    # Add deposit notification
    notification = models.Notification(
        user_id=topup.user_id,
        type="deposit",
        message=f"A deposit of {topup.amount} has been successfully credited to your account."
    )
    db.add(notification)
    
    db.commit()
    
    # Optional: Send email if user.email_notif_deposit is True
    
    return {"message": "Top-up successful"}

# ─── Withdrawals ──────────────────────────────────────────────────────────────

@router.get("/withdrawals", response_model=List[schemas.WithdrawalRequestResponse])
def list_withdrawals(db: Session = Depends(get_db)):
    return db.query(models.WithdrawalRequest).order_by(models.WithdrawalRequest.created_at.desc()).all()

@router.put("/withdrawals/{id}/approve")
def approve_withdrawal(id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    request = db.query(models.WithdrawalRequest).filter(models.WithdrawalRequest.id == id).first()
    if not request or request.status != "pending":
        raise HTTPException(status_code=404, detail="Request not found or already processed")
    
    request.status = "approved"
    request.reviewed_at = datetime.utcnow()
    request.reviewed_by = admin.id
    
    balance = db.query(models.Balance).filter(
        models.Balance.user_id == request.user_id,
        models.Balance.coin_id == request.coin_id
    ).first()
    
    if not balance or balance.amount < request.amount:
        request.status = "rejected"
        db.commit()
        raise HTTPException(status_code=400, detail="Insufficient user balance")

    balance.amount -= request.amount
    
    new_tx = models.Transaction(
        user_id=request.user_id,
        coin_id=request.coin_id,
        type="withdrawal",
        amount=request.amount,
        network=request.network,
        to_address=request.to_address,
        status="approved",
        tx_hash=generate_tx_hash()
    )
    db.add(new_tx)
    
    db.commit()
    return {"message": "Withdrawal approved"}

@router.put("/withdrawals/{id}/reject")
def reject_withdrawal(id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    request = db.query(models.WithdrawalRequest).filter(models.WithdrawalRequest.id == id).first()
    if not request or request.status != "pending":
        raise HTTPException(status_code=404, detail="Request not found or already processed")
    
    request.status = "rejected"
    request.reviewed_at = datetime.utcnow()
    request.reviewed_by = admin.id
    db.commit()
    return {"message": "Withdrawal rejected"}
