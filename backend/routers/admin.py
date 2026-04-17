from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from dependencies import get_admin_user
from utils.simulate import generate_tx_hash
import os
import shutil
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_admin_user)])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

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
        icon_url = f"/uploads/{symbol}_{icon.filename}"
    
    new_coin = models.Coin(name=name, symbol=symbol, icon_url=icon_url)
    db.add(new_coin)
    db.commit()
    db.refresh(new_coin)
    return new_coin

@router.get("/coins", response_model=List[schemas.CoinResponse])
def list_coins(db: Session = Depends(get_db)):
    return db.query(models.Coin).all()

@router.post("/wallets", response_model=schemas.WalletAddressResponse)
def create_wallet_address(wallet: schemas.WalletAddressCreate, db: Session = Depends(get_db)):
    new_address = models.WalletAddress(**wallet.model_dump())
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.get("/wallets", response_model=List[schemas.WalletAddressResponse])
def list_wallets(db: Session = Depends(get_db)):
    return db.query(models.WalletAddress).all()

@router.get("/users", response_model=List[schemas.UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "user").all()

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
    
    db.commit()
    return {"message": "Top-up successful"}

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
    
    # Update transaction record if exists or balance
    # In my logic, we deduct balance ON APPROVAL as per standard simulator flow
    balance = db.query(models.Balance).filter(
        models.Balance.user_id == request.user_id,
        models.Balance.coin_id == request.coin_id
    ).first()
    
    if not balance or balance.amount < request.amount:
        # This shouldn't happen if validation was done on submission, but safety first
        request.status = "rejected"
        db.commit()
        raise HTTPException(status_code=400, detail="Insufficient user balance")

    balance.amount -= request.amount
    
    # Log transaction
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
