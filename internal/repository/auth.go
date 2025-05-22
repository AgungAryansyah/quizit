package repository

import (
	"quizit-be/model/entity"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type IAuthRepository interface {
	StoreSession(session *entity.Session) error
	DeleteSession(userId uuid.UUID) error
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

func (r *AuthRepository) DeleteSession(userId uuid.UUID) error {
	query := `DELETE FROM sessions WHERE user_id = $1`
	_, err := r.db.Exec(query, userId)
	if err != nil {
		return err
	}

	return nil
}
