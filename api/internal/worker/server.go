package worker

import (
	"log"
	"murky_api/internal/config"
	"murky_api/internal/s3"
	"murky_api/internal/worker/db"

	"github.com/hibiken/asynq"
)

func StartServer(conf config.Config, s3Client s3.Client) {
	log.Println("Starting worker server...")

	server := asynq.NewServer(
		asynq.RedisClientOpt{Addr: conf.RedisAddress},
		asynq.Config{
			Concurrency: 10,
		},
	)

	mux := asynq.NewServeMux()
	mux.HandleFunc(TypeDbBackup, db.HandleDbBackup(conf, s3Client))

	err := server.Run(mux)
	if err != nil {
		log.Println("Error starting asynq server:", err)
	}
}
