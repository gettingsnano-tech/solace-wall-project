import httpx
from typing import Dict, Optional

COINGECKO_PRICE_API = "https://api.coingecko.com/api/v3/simple/price"

async def get_coin_price_usd(coin_symbol: str) -> float:
    # Map symbols to Coingecko IDs
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
    }
    
    coin_id = symbol_to_id.get(coin_symbol.lower())
    if not coin_id:
        return 1.0 # Default fallback for stablecoins or unknown
        
    async with httpx.AsyncClient() as client:
        try:
            params = {
                "ids": coin_id,
                "vs_currencies": "usd"
            }
            response = await client.get(COINGECKO_PRICE_API, params=params)
            if response.status_code == 200:
                data = response.json()
                return float(data.get(coin_id, {}).get("usd", 1.0))
        except Exception:
            pass
            
    # Fallback simulated prices
    fallbacks = {
        "btc": 65000.0,
        "eth": 3500.0,
        "usdt": 1.0,
        "bnb": 600.0,
        "sol": 150.0,
    }
    return fallbacks.get(coin_symbol.lower(), 1.0)
