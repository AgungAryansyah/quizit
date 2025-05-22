package repository

import (
	"quizit-be/model/entity"

	"github.com/jmoiron/sqlx"
)

type IAuthRepository interface {
	StoreSession(session *entity.Session) error
}

type AuthRepository struct {
	db *sqlx.DB
}

func NewAuthRepository(db *sqlx.DB) IAuthRepository {
	return &AuthRepository{
		db: db,
	}
}

func (r *AuthRepository) StoreSession(session *entity.Session) error {
	query := `INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(query, session.UserId, session.Token, session.ExpiresAt)
	if err != nil {
		return err
	}

	return nil
}
