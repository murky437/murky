package constants

import "time"

const (
	DbFilePath           = "/app/db/db.sqlite3"
	SqliteDateFormat     = "2006-01-02 15:04:05"
	AccessTokenDuration  = time.Minute * 15
	RefreshTokenDuration = time.Hour * 24 * 7
)
