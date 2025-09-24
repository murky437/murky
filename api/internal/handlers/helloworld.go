package handlers

import "net/http"

func HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("Hello, world!"))
	if err != nil {
		return
	}
}
