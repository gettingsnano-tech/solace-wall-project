from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import httpx
from typing import List
import schemas

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
