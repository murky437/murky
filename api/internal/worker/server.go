package worker

import (
	"log"
	"murky_api/internal/config"

	"github.com/hibiken/asynq"
)

func StartServer(conf config.Config) {
	log.Println("Starting worker server...")

	server := asynq.NewServer(
		asynq.RedisClientOpt{Addr: conf.RedisAddress},
		asynq.Config{
			Concurrency: 10,
		},
	)

	mux := asynq.NewServeMux()
	mux.HandleFunc(TypeDbBackup, HandleDbBackup(&conf))

	err := server.Run(mux)
	if err != nil {
		log.Println("Error starting asynq server:", err)
	}
}
