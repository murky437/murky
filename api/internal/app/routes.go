package app

import (
	"murky_api/internal/auth"
	"murky_api/internal/project"
	"murky_api/internal/routing"
	"murky_api/internal/status"
	"net/http"
)

func NewMux(c *Container) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /auth/create-tokens", routing.Chain(
		auth.CreateTokens(c.Db, c.JwtService),
		routing.RequireJSON,
		routing.CorsMiddleware(c.Config)))
	mux.HandleFunc("POST /auth/refresh-access-token", routing.Chain(
		auth.RefreshAccessToken(c.Db, c.JwtService),
		routing.CorsMiddleware(c.Config)))
	mux.HandleFunc("POST /auth/delete-refresh-token", routing.Chain(
		auth.DeleteRefreshToken(c.Db),
		routing.CorsMiddleware(c.Config)))

	mux.HandleFunc("GET /status", routing.Chain(
		status.Get(c.Config),
		routing.CorsMiddleware(c.Config)))

	protectedMux := http.NewServeMux()
	protectedMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		routing.WriteNotFoundResponse(w)
	})
	protectedMux.HandleFunc("POST /projects", routing.Chain(project.Create(c.Db), routing.RequireJSON))
	protectedMux.HandleFunc("GET /projects", project.GetList(c.Db))
	protectedMux.HandleFunc("GET /projects/{slug}", project.Get(c.Db))
	protectedMux.HandleFunc("PUT /projects/{slug}", routing.Chain(project.Update(c.Db), routing.RequireJSON))
	protectedMux.HandleFunc("PUT /projects/{slug}/notes", routing.Chain(project.UpdateNotes(c.Db), routing.RequireJSON))
	protectedMux.HandleFunc("DELETE /projects/{slug}", project.Delete(c.Db))

	mux.HandleFunc("/", routing.Chain(
		protectedMux.ServeHTTP,
		routing.RequireAuth(c.Db, c.JwtService),
		routing.CorsMiddleware(c.Config),
	))

	return mux
}
