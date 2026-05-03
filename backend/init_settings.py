from database import engine, Base, SessionLocal
import models
from dotenv import load_dotenv
import os

load_dotenv()

def init_settings():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    settings = db.query(models.PlatformSettings).first()
    if not settings:
        settings = models.PlatformSettings(
            users_offset=180000,
            assets_offset=2400000000,
            deposits_offset=1250000
        )
        db.add(settings)
        db.commit()
        print("Platform settings initialized.")
    db.close()

if __name__ == "__main__":
    init_settings()
