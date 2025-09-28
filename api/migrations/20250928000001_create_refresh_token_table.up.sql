CREATE TABLE IF NOT EXISTS refresh_token (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER,
     jwt TEXT,
     expires_at TEXT,
     created_at TEXT DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW'))
);
