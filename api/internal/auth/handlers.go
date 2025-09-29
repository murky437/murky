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

		accessToken, err := jwt.CreateAccessToken(*user, time.Now().UTC().Add(15*time.Minute))
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}
		expiresAt := time.Now().UTC().Add(time.Hour * 24 * 30)

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

		// TODO: set refresh token httponly cookie
		resp := CreateTokensResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshTokenString,
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}
