package model

import (
	"database/sql"
	"errors"
)

type RefreshToken struct {
	Id        int
	UserId    int
	Jwt       string
	ExpiresAt string
}

func SaveRefreshToken(db *sql.DB, refreshToken RefreshToken) error {
	query := "INSERT INTO refresh_token(user_id, jwt, expires_at) VALUES (?,?,?)"
	_, err := db.Exec(query, refreshToken.UserId, refreshToken.Jwt, refreshToken.ExpiresAt)
	if err != nil {
		return err
	}

	return nil
}

func FindRefreshTokenByJwt(db *sql.DB, jwt string) (*RefreshToken, error) {
	query := "SELECT id, user_id, jwt, expires_at FROM refresh_token WHERE jwt = ? LIMIT 1"
	row := db.QueryRow(query, jwt)

	var token RefreshToken
	err := row.Scan(&token.Id, &token.UserId, &token.Jwt, &token.ExpiresAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}

	return &token, err
}
