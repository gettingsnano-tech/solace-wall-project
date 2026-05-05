"""
One-time script: Clears all seeded wallet addresses and user wallet assignments.
Admin will re-populate wallet addresses through the admin panel.
"""
from database import SessionLocal, engine
import models

def clear_wallets():
    db = SessionLocal()
    try:
        # Remove user wallet assignments first (FK constraint)
        deleted_uw = db.query(models.UserWallet).delete()
        print(f"Deleted {deleted_uw} user wallet assignments.")

        # Remove all wallet address pool entries
        deleted_wa = db.query(models.WalletAddress).delete()
        print(f"Deleted {deleted_wa} wallet addresses from pool.")

        db.commit()
        print("[OK] Wallet data cleared. Admin can now add addresses via the admin panel.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_wallets()
