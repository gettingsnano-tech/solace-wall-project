import sqlite3

def upgrade_db():
    conn = sqlite3.connect('c:/Users/ADMIN/Harrison/projects/vibe coding/solace project/backend/core_capital.db')
    c = conn.cursor()
    
    # Add columns to users table
    columns_to_add = [
        ("two_factor_enabled", "BOOLEAN DEFAULT 0"),
        ("two_factor_secret", "VARCHAR"),
        ("email_notif_login", "BOOLEAN DEFAULT 1"),
        ("email_notif_deposit", "BOOLEAN DEFAULT 1"),
        ("email_notif_withdrawal", "BOOLEAN DEFAULT 1"),
        ("is_verified", "BOOLEAN DEFAULT 0"),
        ("verification_token", "VARCHAR")
    ]
    
    for col_name, col_type in columns_to_add:
        try:
            c.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name} to users table")
        except sqlite3.OperationalError:
            print(f"Column {col_name} already exists")
        
    # Create notifications table
    c.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type VARCHAR,
        message VARCHAR,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)
    print("Ensured notifications table exists")
    
    # Create index on user_id
    c.execute("CREATE INDEX IF NOT EXISTS ix_notifications_user_id ON notifications (user_id)")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    upgrade_db()
