package app

import (
	"database/sql"
	"log"
	"murky_api/internal/config"
	"murky_api/internal/jwt"
	"murky_api/internal/s3"

	_ "modernc.org/sqlite"
)

type Container struct {
	Config     *config.Config
	Db         *sql.DB
	JwtService jwt.Service
	S3Client   *s3.Client
}

func NewContainer() *Container {
	conf := config.NewConfig()
	db := setupDatabase(conf)
	jwtService := jwt.NewService(conf)
	s3Client, err := s3.NewClient(conf)
	if err != nil {
		log.Fatal(err)
	}
	return &Container{
		Config:     conf,
		Db:         db,
		JwtService: jwtService,
		S3Client:   s3Client,
	}
}

func setupDatabase(conf *config.Config) *sql.DB {
	db, err := sql.Open("sqlite", conf.DbFilePath)
	if err != nil {
		log.Fatal(err)
	}

	setDatabasePragmas(db)

	return db
}

func setDatabasePragmas(db *sql.DB) {
	if _, err := db.Exec("PRAGMA journal_mode=WAL;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA foreign_keys=ON;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA busy_timeout=5000;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA temp_store=MEMORY;"); err != nil {
		log.Fatal(err)
	}

	if _, err := db.Exec("PRAGMA synchronous=NORMAL;"); err != nil {
		log.Fatal(err)
	}
}

func (c *Container) Close() error {
	if c.Db != nil {
		return c.Db.Close()
	}
	return nil
}
