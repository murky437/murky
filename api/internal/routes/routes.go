package routes

import (
	"murky_api/internal/config"
	"murky_api/internal/handlers"
	"net/http"
)

func NewMux(conf *config.Config) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("OPTIONS /", handlers.OptionsHandler(conf))

	mux.HandleFunc("/", handlers.HelloWorldHandler)

	return mux
}
