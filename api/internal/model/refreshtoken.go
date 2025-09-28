package model

import "database/sql"

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
