package database

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

func ConnectDB() (*sql.DB, error) {
	godotenv.Load()

	DbURL := os.Getenv("DB_URL")
	DbDriver := os.Getenv("DB_DRIVER")

	// scanning .env config
	if DbURL == "" || DbDriver == "" {
		DbDriver = "pgx"
		fmt.Println("oh you forgot to set DB_DRIVER, so we set it to", DbDriver)
		return nil, fmt.Errorf("i think you forgot to set the URL or driver for the database in .env file")
	}

	// trying to connect to database
	db, err := sql.Open(DbDriver, DbURL)
	if err != nil {
		return nil, fmt.Errorf("oops! just a missing database url or driver in config: %w", err)
	}

	// Test Ping
	if err = db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to pinging: %w", err)
	}

	// if everything is fine
	fmt.Println("The database is connected :)")
	return db, nil
}