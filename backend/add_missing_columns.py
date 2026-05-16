import sqlite3

def upgrade_db():
    conn = sqlite3.connect('core_capital.db')
    cursor = conn.cursor()
    
    tables_and_columns = [
        ("users", "kyc_status", "VARCHAR DEFAULT 'not_submitted'"),
        ("users", "kyc_document_type", "VARCHAR"),
        ("users", "kyc_document_front", "VARCHAR"),
        ("users", "kyc_document_back", "VARCHAR"),
        ("users", "kyc_selfie", "VARCHAR"),
        ("users", "kyc_submitted_at", "DATETIME"),
        ("users", "kyc_reviewed_at", "DATETIME"),
        ("users", "kyc_notes", "VARCHAR"),
    ]
    
    for table, new_col, col_type in tables_and_columns:
        cursor.execute(f"PRAGMA table_info({table})")
        columns = [row[1] for row in cursor.fetchall()]
        
        if new_col not in columns:
            try:
                cursor.execute(f"ALTER TABLE {table} ADD COLUMN {new_col} {col_type}")
                print(f"Added {new_col} to {table}")
            except sqlite3.OperationalError as e:
                print(f"Failed to add column to {table}: {e}")
                continue
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    upgrade_db()
