from database import SessionLocal
import models

def fix_missing_networks():
    db = SessionLocal()
    try:
        # Find all user wallets where network is null
        wallets = db.query(models.UserWallet).filter(models.UserWallet.network == None).all()
        print(f"Found {len(wallets)} wallets with missing network.")
        
        fixed_count = 0
        for wallet in wallets:
            if wallet.address and wallet.address.network:
                wallet.network = wallet.address.network
                fixed_count += 1
        
        db.commit()
        print(f"Successfully fixed {fixed_count} wallets.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_missing_networks()
