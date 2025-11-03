package main

import (
	"log"
	"murky_api/internal/app"
	"murky_api/internal/worker"
)

func main() {
	c := app.NewContainer()
	defer func(c *app.Container) {
		err := c.Close()
		if err != nil {
			log.Println(err)
		}
	}(c)

	go worker.StartServer(*c.Config)
	go worker.StartScheduler(*c.Config)

	app.StartApiServer(c)
}
