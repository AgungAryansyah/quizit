package entity

import (
	"time"

	"github.com/google/uuid"
)

type Attempt struct {
	Id           uuid.UUID `json:"id" db:"id"`
	UserId       uuid.UUID `json:"user_id" db:"user_id"`
	QuizId       uuid.UUID `json:"quiz_id" db:"quiz_id"`
	TotalScore   int       `json:"total_score" db:"total_score"`
	FinishedTime time.Time `json:"finished_time" db:"finished_time"`
}
