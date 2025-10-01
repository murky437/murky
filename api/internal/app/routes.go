package app

import (
	"murky_api/internal/auth"
	"murky_api/internal/options"
	"murky_api/internal/project"
	"murky_api/internal/routing"
	"net/http"
)

func NewMux(c *Container) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("OPTIONS /", options.Handler(c.Config))
	mux.HandleFunc("POST /auth/create-tokens", routing.Chain(auth.CreateTokens(c.Db), routing.RequireJSON))

	protectedMux := http.NewServeMux()
	protectedMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		routing.WriteNotFoundResponse(w)
	})
	protectedMux.HandleFunc("POST /projects", routing.Chain(project.CreateProject(c.Db), routing.RequireJSON))
	protectedMux.HandleFunc("GET /projects", project.GetProjectList(c.Db))
	protectedMux.HandleFunc("GET /projects/{slug}", project.GetProject(c.Db))
	protectedMux.HandleFunc("PUT /projects/{slug}", routing.Chain(project.UpdateProject(c.Db), routing.RequireJSON))
	// TODO: delete endpoint

	mux.HandleFunc("/", routing.Chain(
		protectedMux.ServeHTTP,
		routing.RequireAuth(c.Db),
	))

	return mux
}
