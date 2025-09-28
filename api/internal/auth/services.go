package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func isPasswordValid(hashedPassword string, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

var accessTokenSecret = []byte("H@0GLd@gnst4^Bka!2QQM^DMjBsfr7uJF7&4ktPoF^N$KSxYu@egSzVCGcW5LH^n")
var refreshTokenSecret = []byte("Gx!UrY^ZVUjAa^3^O**dgSC0Ho29!A0cruVRBvDT!Sq&qdPiUfSBLoP27RPjNE3&")

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
