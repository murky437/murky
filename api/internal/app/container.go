package app

import (
	"database/sql"
	"log"
	"murky_api/internal/config"
	"murky_api/internal/constants"

	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "modernc.org/sqlite"
)

type Container struct {
	Config *config.Config
	Db     *sql.DB
}

func NewContainer() *Container {
	conf := config.NewConfig()
	db := setupDatabase()
	return &Container{
		Config: conf,
		Db:     db,
	}
}

func setupDatabase() *sql.DB {
	db, err := sql.Open("sqlite", constants.DbFilePath)
	if err != nil {
		log.Fatal(err)
	}

	setDatabasePragmas(db)
	logDatabasePragmas(db)

	return db
}

func setDatabasePragmas(db *sql.DB) {
	if _, err := db.Exec("PRAGMA journal_mode=WAL;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA foreign_keys=ON;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA busy_timeout=5000;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA temp_store=MEMORY;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA synchronous=NORMAL;"); err != nil {
		log.Fatal(err)
	}
}

func logDatabasePragmas(db *sql.DB) {
	var journalMode string
	if err := db.QueryRow("PRAGMA journal_mode;").Scan(&journalMode); err != nil {
		log.Fatal(err)
	}
	log.Println("SQLite journal_mode:", journalMode)

	var fk int
	if err := db.QueryRow("PRAGMA foreign_keys;").Scan(&fk); err != nil {
		log.Fatal(err)
	}
	log.Println("SQLite foreign_keys:", fk)

	var busy int
	if err := db.QueryRow("PRAGMA busy_timeout;").Scan(&busy); err != nil {
		log.Fatal(err)
	}
	log.Println("SQLite busy_timeout (ms):", busy)

	var tempStore int
	if err := db.QueryRow("PRAGMA temp_store;").Scan(&tempStore); err != nil {
		log.Fatal(err)
	}
	log.Println("SQLite temp_store:", tempStore)

	var sync int
	if err := db.QueryRow("PRAGMA synchronous;").Scan(&sync); err != nil {
		log.Fatal(err)
	}
	log.Println("SQLite synchronous:", sync)
}

func (c *Container) Close() error {
	if c.Db != nil {
		return c.Db.Close()
	}
	return nil
}
