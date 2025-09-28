package app

import (
	"murky_api/internal/auth"
	"murky_api/internal/options"
	"murky_api/internal/routing"
	"net/http"
)

func NewMux(c *Container) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		routing.WriteNotFoundResponse(w)
	})

	mux.HandleFunc("OPTIONS /", options.Handler(c.Config))
	
	mux.HandleFunc("POST /auth/create-tokens", routing.Chain(auth.CreateTokens(c.Db), routing.RequireJSON))

	return mux
}
