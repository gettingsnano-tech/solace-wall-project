import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("DATABASE_URL not found in environment.")
    sys.exit(1)

print(f"Connecting to {DATABASE_URL} ...")
engine = create_engine(DATABASE_URL)

def upgrade_postgres():
    tables_and_columns = [
        ("users", "real_created_at", "created_at"),
        ("transactions", "real_created_at", "timestamp"),
        ("withdrawal_requests", "real_created_at", "created_at"),
        ("swap_history", "real_created_at", "created_at")
    ]
    
    with engine.connect() as conn:
        for table, new_col, old_col in tables_and_columns:
            # Check if column already exists
            try:
                conn.execute(text(f"SELECT {new_col} FROM {table} LIMIT 1"))
                print(f"Column {new_col} already exists in {table}.")
            except Exception as e:
                print(f"Adding {new_col} to {table} ...")
                # Need to rollback the failed transaction block
                conn.execute(text("ROLLBACK"))
                try:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {new_col} TIMESTAMP DEFAULT CURRENT_TIMESTAMP"))
                    conn.commit()
                    print(f"Added {new_col} to {table}")
                    
                    conn.execute(text(f"UPDATE {table} SET {new_col} = {old_col} WHERE {new_col} IS NULL OR {new_col} = CURRENT_TIMESTAMP"))
                    conn.commit()
                    print(f"Backfilled {new_col} from {old_col} in {table}")
                except Exception as ex:
                    conn.execute(text("ROLLBACK"))
                    print(f"Failed to alter {table}: {ex}")

if __name__ == "__main__":
    upgrade_postgres()
