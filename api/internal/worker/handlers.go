package worker

import (
	"context"
	"database/sql"
	"log"
	"murky_api/internal/config"
	"path/filepath"
	"time"

	"github.com/hibiken/asynq"
)

func HandleDbBackup(conf *config.Config) asynq.HandlerFunc {
	return func(ctx context.Context, t *asynq.Task) error {
		timestamp := time.Now().Format("20060102T150405")
		backupPath := filepath.Join(conf.DbBackupDir, timestamp+".sqlite3")

		db, err := sql.Open("sqlite", conf.DbFilePath)
		if err != nil {
			return err
		}
		defer db.Close()

		_, err = db.Exec("VACUUM INTO ?", backupPath)
		if err != nil {
			return err
		}

		log.Println("Backup created at:", backupPath)

		// TODO: upload backup to s3
		// TODO: prune old backups (keep min 7 latest, delete others that are older than week)
		// TODO: also prune on s3

		return nil
	}
}
