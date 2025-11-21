package model

import (
	"database/sql"
	"errors"
)

type User struct {
	Id       int
	Username string
	Password string
}

func FindUserByUsername(db *sql.DB, username string) (*User, error) {
	var user User
	query := "SELECT id, username, password FROM user WHERE username = ?"
	err := db.QueryRow(query, username).Scan(&user.Id, &user.Username, &user.Password)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &user, err
}
