import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def upgrade_postgres():
    tables_and_columns = [
        ("users", "kyc_status", "VARCHAR DEFAULT 'not_submitted'"),
        ("users", "kyc_document_type", "VARCHAR"),
        ("users", "kyc_document_front", "VARCHAR"),
        ("users", "kyc_document_back", "VARCHAR"),
        ("users", "kyc_selfie", "VARCHAR"),
        ("users", "kyc_submitted_at", "TIMESTAMP"),
        ("users", "kyc_reviewed_at", "TIMESTAMP"),
        ("users", "kyc_notes", "VARCHAR"),
        ("users", "withdrawal_pin_hash", "VARCHAR"),
    ]
    
    with engine.connect() as conn:
        for table, new_col, col_type in tables_and_columns:
            try:
                conn.execute(text(f"SELECT {new_col} FROM {table} LIMIT 1"))
                print(f"Column {new_col} already exists in {table}.")
            except Exception as e:
                print(f"Adding {new_col} to {table} ...")
                conn.execute(text("ROLLBACK"))
                try:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {new_col} {col_type}"))
                    conn.commit()
                    print(f"Added {new_col} to {table}")
                except Exception as ex:
                    conn.execute(text("ROLLBACK"))
                    print(f"Failed to alter {table}: {ex}")

if __name__ == "__main__":
    upgrade_postgres()
