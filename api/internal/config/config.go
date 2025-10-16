package config

import (
	"os"
	"strings"
)

type Config struct {
	AllowedOrigins     []string
	DbFilePath         string
	AccessTokenSecret  string
	RefreshTokenSecret string
}

func NewConfig() *Config {
	return &Config{
		AllowedOrigins:     strings.Split(os.Getenv("ALLOWED_ORIGINS"), ";"),
		DbFilePath:         os.Getenv("DB_FILE_PATH"),
		AccessTokenSecret:  os.Getenv("ACCESS_TOKEN_SECRET"),
		RefreshTokenSecret: os.Getenv("REFRESH_TOKEN_SECRET"),
	}
}
