package migrations

import (
	"database/sql"
	"errors"
	"log"
)

var migrations = []func(tx *sql.Tx) error{
	v1,
	v2,
	v3,
	v4,
}

func Run(db *sql.DB, logger *log.Logger) error {

	err := createVersionTable(db)
	if err != nil {
		return err
	}

	currentVersion, err := getCurrentVersion(db)
	if err != nil {
		return err
	}

	logger.Println("Current database version:", currentVersion)

	newVersion := currentVersion
	migrationsApplied := 0

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	for i := currentVersion; i < len(migrations); i++ {
		newVersion = i + 1

		logger.Printf("Applying migration v%d", newVersion)

		err = migrations[i](tx)
		if err != nil {
			return err
		}
		_, err = tx.Exec(`INSERT INTO version (number) values (?)`, newVersion)
		if err != nil {
			return err
		}

		migrationsApplied++
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	if migrationsApplied != 0 {
		if migrationsApplied == 1 {
			logger.Printf("Applied 1 new migration")
		} else {
			logger.Printf("Applied %d new migrations", migrationsApplied)
		}
		logger.Println("New database version:", newVersion)
	} else {
		logger.Println("No new migrations applied")
	}

	return nil
}

func createVersionTable(db *sql.DB) error {
	_, err := db.Exec(`
CREATE TABLE IF NOT EXISTS version (
    number INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW'))
);
	`)
	return err
}

func getCurrentVersion(db *sql.DB) (int, error) {
	row := db.QueryRow(`SELECT number FROM version ORDER BY number DESC LIMIT 1`)
	var version int64
	err := row.Scan(&version)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, nil
		}
		return 0, err
	}
	return int(version), nil
}

func v1(tx *sql.Tx) error {
	_, err := tx.Exec(`
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW'))
);
	`)
	return err
}

func v2(tx *sql.Tx) error {
	_, err := tx.Exec(`
CREATE TABLE IF NOT EXISTS refresh_token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    jwt TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);
	`)
	return err
}

func v3(tx *sql.Tx) error {
	_, err := tx.Exec(`
CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS user_project (
    user_id    INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_project_user_id ON user_project(user_id);
	`)
	return err
}

func v4(tx *sql.Tx) error {
	_, err := tx.Exec(`
CREATE TABLE IF NOT EXISTS long_reminder (
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

CREATE INDEX IF NOT EXISTS idx_long_reminder_user_id ON long_reminder(user_id);
	`)
	return err
}
