from database import engine, Base, SessionLocal
import models
from seed import seed
from init_settings import init_settings

def migrate():
    print("Starting migration to PostgreSQL...")
    
    # 0. Drop all tables for a clean slate
    print("Dropping existing tables (if any)...")
    Base.metadata.drop_all(bind=engine)
    
    # 1. Create all tables
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
    
    # 2. Initialize platform settings
    print("Initializing platform settings...")
    init_settings()
    
    # 3. Seed initial data
    print("Seeding database...")
    seed()
    
    print("Migration and seeding complete.")

if __name__ == "__main__":
    migrate()
