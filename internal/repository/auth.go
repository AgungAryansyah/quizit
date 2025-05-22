package repository

import (
	"quizit-be/model/entity"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type IAuthRepository interface {
	StoreSession(session *entity.Session) error
	DeleteSession(userId uuid.UUID) error
	GetSessionByToken(token string) (session *entity.Session, err error)
	ReplaceToken(userId uuid.UUID, token string, expiry time.Time) error
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

func (r *AuthRepository) GetSessionByToken(token string) (session *entity.Session, err error) {
	session = &entity.Session{}

	query := `SELECT * FROM sessions WHERE token = $1`
	err = r.db.Get(session, query, token)
	if err != nil {
		return nil, err
	}

	return session, nil
}

func (r *AuthRepository) ReplaceToken(userId uuid.UUID, token string, expiry time.Time) error {
	query := `UPDATE sessions SET token = $1, expires_at = $2 WHERE user_id = $3`
	_, err := r.db.Exec(query, token, expiry, userId)
	if err != nil {
		return err
	}

	return nil
}
