package app

import (
	"database/sql"
	"errors"
	"fmt"
	"murky_api/internal/config"
	"murky_api/internal/constants"
	"murky_api/internal/jwt"
	"path/filepath"
	"runtime"
	"testing"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/stretchr/testify/require"
)

func NewTestContainer(t *testing.T) *Container {
	conf := config.NewConfig()
	db := setupTestDatabase(t)
	jwtService := jwt.NewService(conf)
	return &Container{
		Config:     conf,
		Db:         db,
		JwtService: jwtService,
	}
}

func setupTestDatabase(t *testing.T) *sql.DB {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatal(err)
	}

	setDatabasePragmas(db)

	driver, err := sqlite.WithInstance(db, &sqlite.Config{})
	if err != nil {
		t.Fatal(err)
	}

	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("cannot get current file path")
	}
	migrationsPath := filepath.Join(filepath.Dir(filename), "../../migrations")

	m, err := migrate.NewWithDatabaseInstance(
		"file://"+migrationsPath,
		"sqlite", driver)
	if err != nil {
		t.Fatal(err)
	}

	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		t.Fatal(err)
	}

	insertBaseTestData(db, t)

	return db
}

func insertBaseTestData(db *sql.DB, t *testing.T) {
	// password = "pass"
	res, err := db.Exec(`INSERT INTO user (username, password) VALUES ('user', '$2a$10$U6X7NnivCljkduExJ9vqt.fqEGQrjxBczds1EbPrQjmLEw0eyUs9K')`)
	require.NoError(t, err)
	userId, err := res.LastInsertId()
	require.NoError(t, err)

	for i := 1; i <= 3; i++ {
		res, err := db.Exec(`INSERT INTO project (title, slug) VALUES (?, ?)`, fmt.Sprintf("Project %d", i), fmt.Sprintf("project-%d", i))
		require.NoError(t, err)
		projectId, err := res.LastInsertId()
		require.NoError(t, err)

		_, err = db.Exec(`INSERT INTO user_project (user_id, project_id) VALUES (?, ?)`, userId, projectId)
		require.NoError(t, err)
	}

	res, err = db.Exec(`INSERT INTO user (username, password) VALUES ('user2', '$2a$10$U6X7NnivCljkduExJ9vqt.fqEGQrjxBczds1EbPrQjmLEw0eyUs9K')`)
	require.NoError(t, err)
	user2Id, err := res.LastInsertId()
	require.NoError(t, err)

	for i := 4; i <= 6; i++ {
		res, err := db.Exec(`INSERT INTO project (title, slug) VALUES (?, ?)`, fmt.Sprintf("Project %d", i), fmt.Sprintf("project-%d", i))
		require.NoError(t, err)
		projectId, err := res.LastInsertId()
		require.NoError(t, err)

		_, err = db.Exec(`INSERT INTO user_project (user_id, project_id) VALUES (?, ?)`, user2Id, projectId)
		require.NoError(t, err)
	}

	insertReminderTestData(db, t, userId)
}

func insertReminderTestData(db *sql.DB, t *testing.T, userId int64) {
	updateTime, err := time.Parse(constants.SqliteDateTimeFormat, "2025-11-11T10:20:30.321Z")
	require.NoError(t, err)

	for i := 1; i <= 2; i++ {
		reminderId := fmt.Sprintf("longReminder%d", i)

		_, err := db.Exec(
			"INSERT INTO long_reminder (id, title, interval_days, user_id, updated_at) VALUES (?, ?, ?, ?, ?)",
			reminderId,
			fmt.Sprintf("Long reminder %d", i),
			40,
			userId,
			updateTime.Format(constants.SqliteDateTimeFormat),
		)
		require.NoError(t, err)
	}
}
