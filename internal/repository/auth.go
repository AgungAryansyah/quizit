package repository

import "github.com/jmoiron/sqlx"

type IAuthRepository interface {
}

type AuthRepository struct {
	db *sqlx.DB
}

func NewAuthRepository(db *sqlx.DB) IAuthRepository {
	return &AuthRepository{
		db: db,
	}
}
