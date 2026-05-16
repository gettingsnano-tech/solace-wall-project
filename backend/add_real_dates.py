import sqlite3

def upgrade_db():
    conn = sqlite3.connect('core_capital.db')
    cursor = conn.cursor()
    
    tables_and_columns = [
        ("users", "real_created_at", "created_at"),
        ("transactions", "real_created_at", "timestamp"),
        ("withdrawal_requests", "real_created_at", "created_at"),
        ("swap_history", "real_created_at", "created_at")
    ]
    
    for table, new_col, old_col in tables_and_columns:
        # Check if column already exists
        cursor.execute(f"PRAGMA table_info({table})")
        columns = [row[1] for row in cursor.fetchall()]
        
        if new_col not in columns:
            try:
                cursor.execute(f"ALTER TABLE {table} ADD COLUMN {new_col} DATETIME")
                print(f"Added {new_col} to {table}")
            except sqlite3.OperationalError as e:
                print(f"Failed to add column to {table}: {e}")
                continue
        
        # Backfill existing rows
        try:
            cursor.execute(f"UPDATE {table} SET {new_col} = {old_col} WHERE {new_col} IS NULL")
            print(f"Backfilled {new_col} from {old_col} in {table}")
        except sqlite3.OperationalError as e:
            print(f"Failed to backfill {table}: {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    upgrade_db()
