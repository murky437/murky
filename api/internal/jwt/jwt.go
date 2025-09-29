package jwt

import (
	"fmt"
	"murky_api/internal/model"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var accessTokenSecret = []byte("H@0GLd@gnst4^Bka!2QQM^DMjBsfr7uJF7&4ktPoF^N$KSxYu@egSzVCGcW5LH^n")
var refreshTokenSecret = []byte("Gx!UrY^ZVUjAa^3^O**dgSC0Ho29!A0cruVRBvDT!Sq&qdPiUfSBLoP27RPjNE3&")

type AccessTokenClaims struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type RefreshTokenClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func CreateAccessToken(user model.User, expiresAt time.Time) (string, error) {
	claims := AccessTokenClaims{
		user.Id,
		user.Username,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString(accessTokenSecret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func CreateRefreshToken(username string, expiresAt time.Time) (string, error) {
	claims := RefreshTokenClaims{
		username,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString(refreshTokenSecret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func ParseAccessToken(tokenStr string) (*AccessTokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &AccessTokenClaims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return accessTokenSecret, nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*AccessTokenClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
