package main

import (
	"fmt"
	"log"
	"murky_api/internal/app"
	"net/http"
)

func main() {
	c := app.NewContainer()
	defer func(c *app.Container) {
		err := c.Close()
		if err != nil {
			log.Println(err)
		}
	}(c)
	mux := app.NewMux(c)

	fmt.Println("Starting server at port 8080...")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Println("Error starting server:", err)
	}
}
