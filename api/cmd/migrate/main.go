package main

import (
	"database/sql"
	"errors"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "modernc.org/sqlite"
)

func main() {
	migrationsPath := flag.String("migrations", "", "Path to migrations folder (required)")
	dbFilePath := flag.String("db", "", "Path to SQLite database file (required)")
	flag.Parse()

	if *migrationsPath == "" || *dbFilePath == "" {
		fmt.Fprintln(os.Stderr, "Error: both -migrations and -db flags are required")
		flag.Usage()
		os.Exit(1)
	}

	db, err := sql.Open("sqlite", *dbFilePath)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer db.Close()

	driver, err := sqlite.WithInstance(db, &sqlite.Config{})
	if err != nil {
		log.Fatalf("Failed to create SQLite driver: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", *migrationsPath),
		"sqlite", driver,
	)
	if err != nil {
		log.Fatalf("Failed to initialize migrate: %v", err)
	}

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("Migration completed successfully")
}
