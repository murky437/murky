package routing

import (
	"net/http"
)

type middleware func(http.HandlerFunc) http.HandlerFunc

func Chain(h http.HandlerFunc, m ...middleware) http.HandlerFunc {
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
