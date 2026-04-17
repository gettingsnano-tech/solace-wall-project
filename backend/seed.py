from database import SessionLocal, engine
import models
from utils.auth import get_password_hash
from utils.simulate import generate_random_address
from decimal import Decimal

def seed():
    db = SessionLocal()
    
    # Create Admin
    admin_user = db.query(models.User).filter(models.User.email == "admin@corecapital.com").first()
    if not admin_user:
        admin_user = models.User(
            email="admin@corecapital.com",
            full_name="System Administrator",
            hashed_password=get_password_hash("Admin@1234"),
            role="admin"
        )
        db.add(admin_user)
        print("Admin user created.")

    # Create Demo Users
    users_data = [
        {"email": "user1@example.com", "name": "John Doe"},
        {"email": "user2@example.com", "name": "Jane Smith"},
    ]
    
    for u in users_data:
        if not db.query(models.User).filter(models.User.email == u["email"]).first():
            user = models.User(
                email=u["email"],
                full_name=u["name"],
                hashed_password=get_password_hash("User@1234"),
                role="user"
            )
            db.add(user)
    
    # Create Coins
    coins_data = [
        {"name": "Bitcoin", "symbol": "BTC", "icon": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"},
        {"name": "Ethereum", "symbol": "ETH", "icon": "https://assets.coingecko.com/coins/images/279/large/ethereum.png"},
        {"name": "Tether", "symbol": "USDT", "icon": "https://assets.coingecko.com/coins/images/325/large/tether.png"},
        {"name": "BNB", "symbol": "BNB", "icon": "https://assets.coingecko.com/coins/images/825/large/bnb.png"},
        {"name": "Solana", "symbol": "SOL", "icon": "https://assets.coingecko.com/coins/images/4128/large/solana.png"},
    ]
    
    for c in coins_data:
        db_coin = db.query(models.Coin).filter(models.Coin.symbol == c["symbol"]).first()
        if not db_coin:
            db_coin = models.Coin(name=c["name"], symbol=c["symbol"], icon_url=c["icon"])
            db.add(db_coin)
            db.flush() # Get ID
            
            # Create some available wallet addresses for each coin
            networks = ["Mainnet", "ERC-20", "TRC-20", "BEP-20"]
            for net in networks:
                for _ in range(5): # 5 addresses per network per coin
                    addr = models.WalletAddress(
                        coin_id=db_coin.id,
                        network=net,
                        address=generate_random_address(),
                        is_used=False
                    )
                    db.add(addr)

    db.commit()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed()
