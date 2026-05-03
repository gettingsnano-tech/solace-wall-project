from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import httpx
from typing import List
import schemas
import models

router = APIRouter(prefix="/api/public", tags=["public"])

COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"

@router.get("/market", response_model=List[schemas.MarketCoin])
async def get_market_data():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(COINGECKO_API)
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                # Fallback to simulated data if API fails or rate limited
                return [
                    {
                        "id": "bitcoin", "name": "Bitcoin", "symbol": "btc", 
                        "current_price": 65000.0, "price_change_percentage_24h": 2.5,
                        "market_cap": 1200000000000, "total_volume": 35000000000,
                        "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                    },
                    {
                        "id": "ethereum", "name": "Ethereum", "symbol": "eth", 
                        "current_price": 3500.0, "price_change_percentage_24h": -1.2,
                        "market_cap": 400000000000, "total_volume": 15000000000,
                        "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
                    }
                ]
        except Exception as e:
            return []

@router.get("/stats")
def get_public_stats(db: Session = Depends(get_db)):
    total_users = db.query(models.User).filter(models.User.role == "user").count()
    pending_withdrawals = db.query(models.WithdrawalRequest).filter(models.WithdrawalRequest.status == "pending").count()
    
    from sqlalchemy import func
    total_deposits = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.type == "deposit",
        models.Transaction.status == "approved"
    ).scalar() or 0
    
    settings = db.query(models.PlatformSettings).first()
    if not settings:
        settings = models.PlatformSettings()
    
    return {
        "users": total_users + settings.users_offset,
        "assets": float(settings.assets_offset), # Static display assets
        "pending_withdrawals": pending_withdrawals + settings.withdrawals_offset,
        "total_deposits": float(total_deposits) + float(settings.deposits_offset),
        "uptime": settings.uptime_display,
        "encryption": settings.encryption_display
    }

@router.get("/exchanges", response_model=List[schemas.ExchangeResponse])
def list_active_exchanges(db: Session = Depends(get_db)):
    return db.query(models.Exchange).filter(models.Exchange.is_active == True).all()
