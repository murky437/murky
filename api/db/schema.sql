CREATE TABLE schema_migrations (version uint64,dirty bool);
CREATE UNIQUE INDEX version_unique ON schema_migrations (version);
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW'))
);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE refresh_token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    jwt TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);
CREATE TABLE project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    updated_at TEXT
);
CREATE TABLE user_project (
    user_id    INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_project_user_id ON user_project(user_id);
CREATE TABLE long_reminder (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    interval_days INTEGER NOT NULL,
    user_id INTEGER NOT NULL REFERENCES user(id),
    created_at TEXT DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    updated_at TEXT,
    last_reminded_at TEXT,
    marked_done_at TEXT,
    is_enabled INTEGER DEFAULT 1
);
CREATE INDEX idx_long_reminder_user_id ON long_reminder(user_id);
CREATE TABLE version (
    number INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW'))
);
