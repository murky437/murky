package worker

import (
	"log"
	"murky_api/internal/config"
	"time"

	"github.com/hibiken/asynq"
)

func StartScheduler(conf config.Config) {
	log.Println("Scheduling worker tasks...")

	loc, err := time.LoadLocation(conf.Timezone)
	if err != nil {
		log.Println(err)
		return
	}

	scheduler := asynq.NewScheduler(
		asynq.RedisClientOpt{Addr: conf.RedisAddress},
		&asynq.SchedulerOpts{
			Location: loc,
		},
	)

	_, err = scheduler.Register("0 3 * * *", asynq.NewTask(TypeDbBackup, nil))
	if err != nil {
		log.Println(err)
		return
	}
	_, err = scheduler.Register("0 12 * * *", asynq.NewTask(TypeLongReminderPush, nil))
	if err != nil {
		log.Println(err)
		return
	}

	err = scheduler.Run()
	if err != nil {
		log.Println(err)
	}
}
