package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Println("Usage: backupdb <db_file> <backup_dir>")
		os.Exit(1)
	}

	dbPath := os.Args[1]
	backupDir := os.Args[2]

	timestamp := time.Now().Format("20060102150405")
	backupPath := filepath.Join(backupDir, timestamp+".sqlite3")

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatal("Failed to open source DB:", err)
	}
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			log.Fatal("Failed to close DB:", err)
		}
	}(db)

	_, err = db.Exec("VACUUM INTO ?", backupPath)
	if err != nil {
		log.Fatal("Failed to create backup:", err)
	}

	fmt.Println("Backup created at:", backupPath)
}
