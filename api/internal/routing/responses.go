package routing

import (
	"encoding/json"
	"log"
	"murky_api/internal/validation"
	"net/http"
)

const (
	NotFoundMessage            = "Not found"
	ContentTypeNotJsonMessage  = "Content-Type must be application/json"
	InvalidJsonMessage         = "Invalid JSON"
	InternalServerErrorMessage = "Internal server error"
	UnauthorizedMessage        = "Unauthorized"
)

type GeneralErrorResponse struct {
	Message string `json:"message"`
}

type ValidationErrorResponse struct {
	GeneralErrors []string            `json:"generalErrors"`
	FieldErrors   map[string][]string `json:"fieldErrors"`
}

func WriteJsonResponse(w http.ResponseWriter, status int, content any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(content)
	if err != nil {
		log.Println(err)
	}
	return
}

func WriteNotFoundResponse(w http.ResponseWriter) {
	WriteJsonResponse(w, http.StatusNotFound, GeneralErrorResponse{Message: NotFoundMessage})
}

func WriteInternalServerErrorResponse(w http.ResponseWriter) {
	WriteJsonResponse(w, http.StatusInternalServerError, GeneralErrorResponse{Message: InternalServerErrorMessage})
}

func WriteContentTypeNotJsonResponse(w http.ResponseWriter) {
	WriteJsonResponse(w, http.StatusUnsupportedMediaType, GeneralErrorResponse{Message: ContentTypeNotJsonMessage})
}

func WriteInvalidJsonResponse(w http.ResponseWriter) {
	WriteJsonResponse(w, http.StatusBadRequest, GeneralErrorResponse{Message: InvalidJsonMessage})
}

func WriteValidationErrorResponse(w http.ResponseWriter, validationResult validation.Result) {
	WriteJsonResponse(w, http.StatusUnprocessableEntity, ValidationErrorResponse(validationResult))
}

func WriteUnauthorizedResponse(w http.ResponseWriter) {
	WriteJsonResponse(w, http.StatusUnauthorized, GeneralErrorResponse{Message: UnauthorizedMessage})
}
