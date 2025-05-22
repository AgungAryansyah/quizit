package entity

import (
	"time"

	"github.com/google/uuid"
)

type Quiz struct {
	Id        uuid.UUID  `json:"id" db:"id" `
	Theme     string     `json:"theme" db:"theme"`
	Title     string     `json:"title" db:"title"`
	Questions []Question `json:"questions" db:"questions"`
}

type Question struct {
	Id      uuid.UUID `json:"id" db:"id"`
	QuizId  uuid.UUID `json:"quiz_id" db:"quiz_id"`
	Score   int       `json:"score" db:"score"`
	Text    string    `json:"text" db:"text"`
	Image   string    `json:"image" db:"image"`
	Options []Option  `json:"options" db:"options"`
}

type Option struct {
	Id         uuid.UUID `json:"id" db:"id"`
	QuestionId uuid.UUID `json:"question_id" db:"question_id"`
	IsCorrect  bool      `json:"is_correct" db:"is_correct"`
	Text       string    `json:"text" db:"text"`
	Image      string    `json:"image" db:"image"`
}

type Attempt struct {
	Id           uuid.UUID `json:"id" db:"attempt_id"`
	UserId       uuid.UUID `json:"user_id" db:"user_id"`
	QuizId       uuid.UUID `json:"quiz_id" db:"quiz_id"`
	TotalScore   int       `json:"total_score" db:"total_score"`
	FinishedTime time.Time `json:"finished_time" db:"finished_time"`
}
