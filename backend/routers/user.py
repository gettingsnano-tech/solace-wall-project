from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from dependencies import get_current_user
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/coins", response_model=List[schemas.CoinResponse])
def get_user_coins(db: Session = Depends(get_db)):
    return db.query(models.Coin).filter(models.Coin.is_active == True).all()

@router.get("/wallets", response_model=List[schemas.WalletAddressResponse])
def get_user_wallets(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # Returns all addresses assigned to this user
    assigned_wallets = db.query(models.UserWallet).filter(models.UserWallet.user_id == user.id).all()
    address_ids = [w.address_id for w in assigned_wallets]
    return db.query(models.WalletAddress).filter(models.WalletAddress.id.in_(address_ids)).all()

@router.post("/wallets/generate", response_model=schemas.WalletAddressResponse)
def generate_wallet(coin_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # Check if user already has a wallet for this coin
    existing = db.query(models.UserWallet).filter(
        models.UserWallet.user_id == user.id,
        models.UserWallet.coin_id == coin_id
    ).first()
    if existing:
        return db.query(models.WalletAddress).filter(models.WalletAddress.id == existing.address_id).first()
    
    # Assign new address
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
    db.refresh(address)
    return address

@router.get("/balances", response_model=List[schemas.BalanceResponse])
def get_user_balances(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    balances = db.query(models.Balance).filter(models.Balance.user_id == user.id).all()
    return balances

@router.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_user_transactions(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Transaction).filter(models.Transaction.user_id == user.id).order_by(models.Transaction.timestamp.desc()).all()

@router.post("/withdraw")
def request_withdrawal(request: schemas.WithdrawalRequestCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
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
    db.commit()
    return {"message": "Withdrawal request submitted for approval"}
