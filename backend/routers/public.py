from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import httpx
from typing import List
import schemas
import models

router = APIRouter(prefix="/api/public", tags=["public"])

@router.get("/market", response_model=List[schemas.MarketCoin])
async def get_market_data(db: Session = Depends(get_db)):
    # Get all active coins from DB
    active_coins = db.query(models.Coin).filter(models.Coin.is_active == True).all()
    
    # Map symbols to Coingecko IDs (reusing mapping logic)
    symbol_to_id = {
        "btc": "bitcoin",
        "eth": "ethereum",
        "usdt": "tether",
        "bnb": "binancecoin",
        "sol": "solana",
        "ada": "cardano",
        "xrp": "ripple",
        "dot": "polkadot",
        "doge": "dogecoin",
        "matic": "matic-network",
        "shib": "shiba-inu",
        "link": "chainlink",
        "ltc": "litecoin",
        "trx": "tron",
    }
    
    ids = []
    for coin in active_coins:
        cid = symbol_to_id.get(coin.symbol.lower())
        if cid:
            ids.append(cid)
            
    if not ids:
        # Default fallback list if no coins in DB match mapping
        ids = ["bitcoin", "ethereum", "tether", "binancecoin", "solana"]

    ids_str = ",".join(ids)
    url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={ids_str}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()
            else:
                # Fallback to simulated data if API fails
                return [
                    {
                        "id": "bitcoin", "name": "Bitcoin", "symbol": "btc", 
                        "current_price": 65000.0, "price_change_percentage_24h": 0.5,
                        "market_cap": 1200000000000, "total_volume": 35000000000,
                        "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                    },
                    {
                        "id": "ethereum", "name": "Ethereum", "symbol": "eth", 
                        "current_price": 3500.0, "price_change_percentage_24h": -0.2,
                        "market_cap": 400000000000, "total_volume": 15000000000,
                        "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
                    },
                    {
                        "id": "tether", "name": "Tether", "symbol": "usdt", 
                        "current_price": 1.0, "price_change_percentage_24h": 0.0,
                        "market_cap": 100000000000, "total_volume": 50000000000,
                        "image": "https://assets.coingecko.com/coins/images/325/large/tether.png"
                    }
                ]
        except Exception:
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
        "users": total_users + (settings.users_offset or 0),
        "assets": float(settings.assets_offset or 0), # Static display assets
        "pending_withdrawals": pending_withdrawals + (settings.withdrawals_offset or 0),
        "total_deposits": float(total_deposits) + float(settings.deposits_offset or 0),
        "uptime": settings.uptime_display or "99.99%",
        "encryption": settings.encryption_display or "256-bit"
    }

@router.get("/exchanges", response_model=List[schemas.ExchangeResponse])
def list_active_exchanges(db: Session = Depends(get_db)):
    return db.query(models.Exchange).filter(models.Exchange.is_active == True).all()

@router.get("/contact-info")
def get_contact_info(db: Session = Depends(get_db)):
    settings = db.query(models.PlatformSettings).first()
    if not settings:
        return {
            "email": "support@capitaltsx.com",
            "phone": "+1 (555) 000-0000",
            "address": "123 Crypto Ave, Blockchain City"
        }
    return {
        "email": settings.contact_email,
        "phone": settings.contact_phone,
        "address": settings.contact_address
    }
