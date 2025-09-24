package config

import (
	"os"
	"strings"
)

type Config struct {
	AllowedOrigins []string
}

func NewConfig() *Config {
	return &Config{
		AllowedOrigins: strings.Split(os.Getenv("ALLOWED_ORIGINS"), ";"),
	}
}
