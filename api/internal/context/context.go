package context

import (
	"murky_api/internal/jwt"
	"net/http"
)

const (
	AccessToken = "accessToken"
)

type AuthUser struct {
	Id       int
	Username string
}

func GetAccessTokenClaims(r *http.Request) *jwt.AccessTokenClaims {
	if claims, ok := r.Context().Value(AccessToken).(*jwt.AccessTokenClaims); ok {
		return claims
	}
	return nil
}

func GetCurrentUser(r *http.Request) AuthUser {
	claims := GetAccessTokenClaims(r)
	if claims == nil {
		return AuthUser{}
	}
	return AuthUser{
		Id:       claims.Id,
		Username: claims.Username,
	}
}
