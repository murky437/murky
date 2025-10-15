package config

import (
	"os"
	"strings"
)

type Config struct {
	AllowedOrigins []string
	DbFilePath     string
}

func NewConfig() *Config {
	return &Config{
		AllowedOrigins: strings.Split(os.Getenv("ALLOWED_ORIGINS"), ";"),
		DbFilePath:     os.Getenv("DB_FILE_PATH"),
	}
}
