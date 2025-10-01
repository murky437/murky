package routing

import (
	"context"
	"database/sql"
	mycontext "murky_api/internal/context"
	"murky_api/internal/jwt"
	"net/http"
	"strings"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

func Chain(h http.HandlerFunc, m ...Middleware) http.HandlerFunc {
	for i := 0; i < len(m); i++ {
		h = m[i](h)
	}
	return h
}

func RequireJSON(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Content-Type") != "application/json" {
			WriteContentTypeNotJsonResponse(w)
			return
		}
		next(w, r)
	}
}

func RequireAuth(db *sql.DB) Middleware {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			auth := r.Header.Get("Authorization")
			if !strings.HasPrefix(auth, "Bearer ") || len(auth) <= 7 {
				WriteUnauthorizedResponse(w)
				return
			}
			tokenStr := strings.TrimPrefix(auth, "Bearer ")
			claims, err := jwt.ParseAccessToken(tokenStr)
			if err != nil {
				WriteUnauthorizedResponse(w)
				return
			}
			var exists bool
			err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM user WHERE username = ?)", claims.Username).Scan(&exists)
			if err != nil || !exists {
				WriteUnauthorizedResponse(w)
				return
			}

			ctx := context.WithValue(r.Context(), mycontext.AccessToken, claims)
			next(w, r.WithContext(ctx))
		}
	}
}
