"""
One-time migration: Adds withdrawal_pin_hash column to users table.
Safe to run multiple times (uses IF NOT EXISTS).
"""
from database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS withdrawal_pin_hash VARCHAR;
        """))
        conn.commit()
        print("[OK] withdrawal_pin_hash column added to users table.")

if __name__ == "__main__":
    migrate()
