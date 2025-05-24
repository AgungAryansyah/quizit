package repository

import (
	"quizit-be/model/entity"

	"github.com/jmoiron/sqlx"
)

type IAttemptRepository interface {
	CreteAttempt(attempt *entity.Attempt) error
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
