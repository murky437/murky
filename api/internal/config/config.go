package config

import (
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	AllowedOrigins     []string
	DbFilePath         string
	AccessTokenSecret  string
	RefreshTokenSecret string
	DeployFilePath     string
	DbBackupDir        string
	RedisAddress       string
	Timezone           string
}

func NewConfig() *Config {
	exePath, _ := os.Executable()
	deployFilePath := filepath.Join(filepath.Dir(exePath), "deploy.json")

	return &Config{
		AllowedOrigins:     strings.Split(os.Getenv("ALLOWED_ORIGINS"), ";"),
		DbFilePath:         os.Getenv("DB_FILE_PATH"),
		AccessTokenSecret:  os.Getenv("ACCESS_TOKEN_SECRET"),
		RefreshTokenSecret: os.Getenv("REFRESH_TOKEN_SECRET"),
		DeployFilePath:     deployFilePath,
		DbBackupDir:        os.Getenv("DB_BACKUP_DIR"),
		RedisAddress:       os.Getenv("REDIS_ADDRESS"),
		Timezone:           os.Getenv("TIMEZONE"),
	}
}
