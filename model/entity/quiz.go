package entity

import (
	"github.com/google/uuid"
)

type Quiz struct {
	Id       uuid.UUID `json:"id" db:"id"`
	Theme    string    `json:"theme" db:"theme"`
	Title    string    `json:"title" db:"title"`
	UserId   uuid.UUID `json:"user_id" db:"user_id"`
	QuizCode string    `json:"quiz_code" db:"quiz_code"`
}

type Question struct {
	Id     uuid.UUID `json:"id" db:"id"`
	QuizId uuid.UUID `json:"quiz_id" db:"quiz_id"`
	Score  int       `json:"score" db:"score"`
	Text   string    `json:"text" db:"text"`
	Image  string    `json:"image" db:"image"`
}

type Option struct {
	Id         uuid.UUID `json:"id" db:"id"`
	QuestionId uuid.UUID `json:"question_id" db:"question_id"`
	IsCorrect  bool      `json:"is_correct" db:"is_correct"`
	Text       string    `json:"text" db:"text"`
	Image      string    `json:"image" db:"image"`
}
