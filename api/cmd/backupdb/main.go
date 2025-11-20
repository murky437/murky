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

// TODO: remove this from deploy pipeline
// Maybe delete completely since it is handled by worker process already.
// Weigh the usefulness of leaving it as a separate command.
func main() {
	if len(os.Args) != 3 {
		fmt.Println("Usage: backupdb <db_file> <backup_dir>")
		os.Exit(1)
	}

	dbPath := os.Args[1]
	backupDir := os.Args[2]

	err := os.MkdirAll(backupDir, 0755)
	if err != nil {
		log.Println("Error creating backup directory:", err)
		return
	}

	timestamp := time.Now().Format("20060102T150405")
	backupPath := filepath.Join(backupDir, timestamp+".sqlite3")

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		log.Println("Failed to open source DB:", err)
		return
	}
	defer db.Close()

	_, err = db.Exec("VACUUM INTO ?", backupPath)
	if err != nil {
		log.Println("Failed to create backup:", err)
		return
	}

	log.Println("Backup created at:", backupPath)
}
