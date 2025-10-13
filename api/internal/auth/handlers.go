package auth

import (
	"database/sql"
	"encoding/json"
	"log"
	"murky_api/internal/constants"
	"murky_api/internal/jwt"
	"murky_api/internal/model"
	"murky_api/internal/routing"
	"murky_api/internal/validation"
	"net/http"
	"time"
)

func CreateTokens(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CreateTokensRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			routing.WriteInvalidJsonResponse(w)
			return
		}

		validationResult := req.Validate()
		if validationResult != nil {
			routing.WriteValidationErrorResponse(w, *validationResult)
			return
		}

		user, err := model.FindUserByUsername(db, req.Username)
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		if user == nil || !isPasswordValid(user.Password, req.Password) {
			routing.WriteValidationErrorResponse(w, validation.Result{GeneralErrors: []string{"Invalid credentials"}})
			return
		}

		accessToken, err := jwt.CreateAccessToken(*user, time.Now().UTC().Add(constants.AccessTokenDuration))
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}
		expiresAt := time.Now().UTC().Add(constants.RefreshTokenDuration)

		refreshTokenString, err := jwt.CreateRefreshToken(req.Username, expiresAt)
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		refreshToken := model.RefreshToken{
			UserId:    user.Id,
			Jwt:       refreshTokenString,
			ExpiresAt: expiresAt.Format(constants.SqliteDateFormat),
		}

		if err := model.SaveRefreshToken(db, refreshToken); err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    refreshTokenString,
			Path:     "/",
			HttpOnly: true,
			Secure:   false, // TODO: set to secure based on env (dev = false, prod = true)
			SameSite: http.SameSiteLaxMode,
			Expires:  expiresAt,
		})

		resp := CreateTokensResponse{
			AccessToken: accessToken,
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}

func RefreshAccessToken(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("refresh_token")

		if err != nil || cookie.Value == "" {
			routing.WriteUnauthorizedResponse(w)
			return
		}

		claims, err := jwt.ParseRefreshToken(cookie.Value)
		if err != nil {
			routing.WriteUnauthorizedResponse(w)
			return
		}

		user, err := model.FindUserByUsername(db, claims.Username)
		if err != nil || user == nil {
			routing.WriteUnauthorizedResponse(w)
			return
		}

		dbToken, err := model.FindRefreshTokenByJwt(db, cookie.Value)
		if err != nil || dbToken == nil {
			routing.WriteUnauthorizedResponse(w)
			return
		}

		expiresAt, err := time.Parse(constants.SqliteDateFormat, dbToken.ExpiresAt)
		if err != nil || time.Now().After(expiresAt) {
			routing.WriteUnauthorizedResponse(w)
			return
		}

		newAccessToken, err := jwt.CreateAccessToken(*user, time.Now().UTC().Add(constants.AccessTokenDuration))
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		resp := RefreshAccessTokenResponse{
			AccessToken: newAccessToken,
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}

func DeleteRefreshToken(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("refresh_token")

		if err != nil || cookie.Value == "" {
			routing.WriteJsonResponse(w, http.StatusNoContent, nil)
			return
		}

		err = model.DeleteRefreshToken(db, cookie.Value)
		if err != nil {
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			MaxAge:   -1})

		routing.WriteJsonResponse(w, http.StatusNoContent, nil)
	}
}
