package postgres

import (
	"fmt"
	"quizit-be/pkg/env"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func Connect(env env.Env) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", fmt.Sprintf("user=%s password=%s dbname=%s host=%s sslmode=disable", env.DB_USER, env.DB_PASS, env.DB_NAME, env.DB_HOST))
	if err != nil {
		return nil, err
	}
	return db, err
}
