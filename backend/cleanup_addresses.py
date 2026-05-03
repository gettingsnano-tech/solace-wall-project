from database import SessionLocal
import models

def cleanup():
    db = SessionLocal()
    try:
        # Delete addresses with no network
        deleted = db.query(models.WalletAddress).filter(
            (models.WalletAddress.network == None) | (models.WalletAddress.network == "")
        ).delete(synchronize_session=False)
        
        db.commit()
        print(f"Successfully removed {deleted} invalid addresses from the pool.")
    except Exception as e:
        print(f"Error during cleanup: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    cleanup()
