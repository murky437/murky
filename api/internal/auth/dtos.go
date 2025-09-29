package auth

import (
	"murky_api/internal/validation"
	"strings"
)

type CreateTokensRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (request *CreateTokensRequest) Validate() *validation.Result {
	result := &validation.Result{
		GeneralErrors: []string{},
		FieldErrors:   make(map[string][]string),
	}

	if strings.TrimSpace(request.Username) == "" {
		result.FieldErrors["username"] = append(result.FieldErrors["username"], validation.NotBlankMessage)
	}

	if strings.TrimSpace(request.Password) == "" {
		result.FieldErrors["password"] = append(result.FieldErrors["password"], validation.NotBlankMessage)
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
