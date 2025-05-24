package repository

import (
	"database/sql"
	"errors"
	"quizit-be/model/entity"
	"quizit-be/pkg/response"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type IAttemptRepository interface {
	CreteAttempt(attempt *entity.Attempt) error
	GetUserAttempt(userId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error)
	GetQuizAttempt(quizId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error)
	GetBestAttempt(userId uuid.UUID, quizId uuid.UUID) (attempt *entity.Attempt, err error)
}

type AttemptRepository struct {
	db *sqlx.DB
}

func NewAttemptRepository(db *sqlx.DB) IAttemptRepository {
	return &AttemptRepository{
		db: db,
	}
}

func (r *AttemptRepository) CreteAttempt(attempt *entity.Attempt) error {
	query := `
		INSERT INTO attempts (id, user_id, quiz_id, total_score, finished_time)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.Exec(query, attempt.Id, attempt.UserId, attempt.QuizId, attempt.TotalScore, attempt.FinishedTime)
	return err
}

func (r *AttemptRepository) GetUserAttempt(userId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error) {
	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	attempts = &[]entity.Attempt{}
	query := `SELECT * FROM attempts WHERE user_id = $1 LIMIT $2 OFFSET $3`
	err = r.db.Select(attempts, query, userId, pageSize, offset)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.AttemptNotFound
	}

	return attempts, err
}

func (r *AttemptRepository) GetQuizAttempt(quizId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error) {
	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	attempts = &[]entity.Attempt{}
	query := `SELECT * FROM attempts WHERE quiz_id = $1 LIMIT $2 OFFSET $3`
	err = r.db.Select(attempts, query, quizId, pageSize, offset)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.AttemptNotFound
	}

	return attempts, err
}

func (r *AttemptRepository) GetBestAttempt(userId uuid.UUID, quizId uuid.UUID) (attempt *entity.Attempt, err error) {
	attempt = &entity.Attempt{}
	query := `SELECT * FROM attempts WHERE user_id = $1 AND quiz_id = $2 ORDER BY total_score DESC LIMIT 1`
	err = r.db.Get(attempt, query, userId, quizId)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.AttemptNotFound
	}

	return attempt, err
}
