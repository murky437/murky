package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"murky_api/internal/config"
	"murky_api/internal/routes"
	"net/http"
	"os"
	"slices"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/mattn/go-sqlite3"
)

const (
	NotBlankMessage = "Must not be blank"
)

const (
	NotFoundMessage            = "Not found"
	ContentTypeNotJsonMessage  = "Content-Type must be application/json"
	InvalidJsonMessage         = "Invalid JSON"
	InternalServerErrorMessage = "Internal server error"
)

const (
	DbFilePath       = "/app/db/db.sqlite3"
	SqliteDateFormat = "2006-01-02 15:04:05"
)

var accessTokenSecret = []byte("H@0GLd@gnst4^Bka!2QQM^DMjBsfr7uJF7&4ktPoF^N$KSxYu@egSzVCGcW5LH^n")
var refreshTokenSecret = []byte("Gx!UrY^ZVUjAa^3^O**dgSC0Ho29!A0cruVRBvDT!Sq&qdPiUfSBLoP27RPjNE3&")

type GeneralErrorResponse struct {
	Message string `json:"message"`
}

type ValidationErrorResponse struct {
	GeneralErrors []string            `json:"generalErrors"`
	FieldErrors   map[string][]string `json:"fieldErrors"`
}

type ValidationResult struct {
	GeneralErrors []string
	FieldErrors   map[string][]string
}

type CreateTokensRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (createTokensRequest *CreateTokensRequest) Validate() *ValidationResult {
	result := &ValidationResult{
		GeneralErrors: []string{},
		FieldErrors:   make(map[string][]string),
	}

	if strings.TrimSpace(createTokensRequest.Username) == "" {
		result.FieldErrors["username"] = append(result.FieldErrors["username"], NotBlankMessage)
	}

	if strings.TrimSpace(createTokensRequest.Password) == "" {
		result.FieldErrors["password"] = append(result.FieldErrors["password"], NotBlankMessage)
	}

	if len(result.GeneralErrors) > 0 || len(result.FieldErrors) > 0 {
		return result
	}

	return nil
}

type CreateTokensResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func sendJsonResponse(w http.ResponseWriter, r *http.Request, statusCode int, resp any) {
	// TODO: check if this is ok for CORS

	allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ";")

	origin := r.Header.Get("Origin")
	if slices.Contains(allowedOrigins, origin) {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(resp)
}

func sendGeneralErrorResponse(w http.ResponseWriter, r *http.Request, statusCode int, message string) {
	resp := GeneralErrorResponse{
		Message: message,
	}
	sendJsonResponse(w, r, statusCode, resp)
}

func sendNotFoundErrorResponse(w http.ResponseWriter, r *http.Request) {
	sendGeneralErrorResponse(w, r, http.StatusNotFound, NotFoundMessage)
}

func sendInvalidContentTypeResponse(w http.ResponseWriter, r *http.Request) {
	sendGeneralErrorResponse(w, r, http.StatusUnsupportedMediaType, ContentTypeNotJsonMessage)
}

func sendInvalidJsonResponse(w http.ResponseWriter, r *http.Request) {
	sendGeneralErrorResponse(w, r, http.StatusBadRequest, InvalidJsonMessage)
}

func sendInternalServerErrorResponse(w http.ResponseWriter, r *http.Request) {
	sendGeneralErrorResponse(w, r, http.StatusInternalServerError, InternalServerErrorMessage)
}

func sendValidationErrorResponse(w http.ResponseWriter, r *http.Request, validationResult ValidationResult) {
	resp := ValidationErrorResponse(validationResult)
	sendJsonResponse(w, r, http.StatusUnprocessableEntity, resp)
}

func sendGeneralValidationErrorResponse(w http.ResponseWriter, r *http.Request, message string) {
	result := ValidationResult{
		GeneralErrors: []string{message},
	}
	sendValidationErrorResponse(w, r, result)
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	sendNotFoundErrorResponse(w, r)
}

func authCreateTokensHandler(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("Content-Type") != "application/json" {
		sendInvalidContentTypeResponse(w, r)
		return
	}

	var req CreateTokensRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		sendInvalidJsonResponse(w, r)
		return
	}

	if validationResult := req.Validate(); validationResult != nil {
		sendValidationErrorResponse(w, r, *validationResult)
		return
	}

	user, err := findUserByUsername(req.Username)
	if err != nil {
		log.Println(err)
		sendInternalServerErrorResponse(w, r)
		return
	}

	if user == nil || !isPasswordValid(user.Password, req.Password) {
		sendGeneralValidationErrorResponse(w, r, "Invalid credentials")
		return
	}

	accessToken, err := createAccessToken(req.Username, time.Now().UTC().Add(15*time.Minute))
	if err != nil {
		log.Println(err)
		sendInternalServerErrorResponse(w, r)
		return
	}

	expiresAt := time.Now().UTC().Add(time.Hour * 24 * 30)

	refreshToken, err := createRefreshToken(req.Username, expiresAt)
	if err != nil {
		log.Println(err)
		sendInternalServerErrorResponse(w, r)
		return
	}

	refreshTokenEntity := RefreshTokenEntity{
		UserId:    user.Id,
		jwt:       refreshToken,
		expiresAt: expiresAt.Format(SqliteDateFormat),
	}

	if err := saveRefreshToken(refreshTokenEntity); err != nil {
		log.Println(err)
		sendInternalServerErrorResponse(w, r)
		return
	}

	// TODO: set refresh token httponly cookie
	resp := CreateTokensResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	sendJsonResponse(w, r, http.StatusOK, resp)
}

type UserEntity struct {
	Id       int
	Username string
	Password string
}

type RefreshTokenEntity struct {
	Id        int
	UserId    int
	jwt       string
	expiresAt string
}

func findUserByUsername(username string) (*UserEntity, error) {
	db, err := sql.Open("sqlite3", DbFilePath)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var user UserEntity
	query := "SELECT id, username, password FROM user WHERE username = ?"
	err = db.QueryRow(query, username).Scan(&user.Id, &user.Username, &user.Password)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Return nil instead of an error
		}
		return nil, err
	}

	return &user, nil
}

func isPasswordValid(hashedPassword string, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

func createAccessToken(username string, expiresAt time.Time) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"exp":      expiresAt.Unix(),  // Expiration time
		"iat":      time.Now().Unix(), // Issued at
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString(accessTokenSecret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func createRefreshToken(username string, expiresAt time.Time) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"exp":      expiresAt.Unix(),  // Expiration time
		"iat":      time.Now().Unix(), // Issued at
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString(refreshTokenSecret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func saveRefreshToken(refreshTokenEntity RefreshTokenEntity) error {
	db, err := sql.Open("sqlite3", DbFilePath)
	if err != nil {
		return err
	}
	defer db.Close()

	sql := "INSERT INTO refresh_token(user_id, jwt, expires_at) VALUES (?,?,?)"
	_, err = db.Exec(sql, refreshTokenEntity.UserId, refreshTokenEntity.jwt, refreshTokenEntity.expiresAt)
	if err != nil {
		return err
	}

	return nil
}

func main() {
	conf := config.NewConfig()
	mux := routes.NewMux(conf)

	fmt.Println("Starting server at port 8080...")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Println("Error starting server:", err)
	}
}
