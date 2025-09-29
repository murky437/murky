package auth

import (
	"golang.org/x/crypto/bcrypt"
)

func isPasswordValid(hashedPassword string, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}
