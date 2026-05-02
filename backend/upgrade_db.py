import sqlite3

def upgrade_db():
    conn = sqlite3.connect('c:/Users/ADMIN/Harrison/projects/vibe coding/solace project/backend/core_capital.db')
    c = conn.cursor()
    
    # Add columns to users table
    try:
        c.execute("ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT 0")
        c.execute("ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR")
        c.execute("ALTER TABLE users ADD COLUMN email_notif_login BOOLEAN DEFAULT 1")
        c.execute("ALTER TABLE users ADD COLUMN email_notif_deposit BOOLEAN DEFAULT 1")
        c.execute("ALTER TABLE users ADD COLUMN email_notif_withdrawal BOOLEAN DEFAULT 1")
        print("Added columns to users table")
    except sqlite3.OperationalError as e:
        print(f"Columns might already exist: {e}")
        
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
