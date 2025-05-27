package dto

import (
	"github.com/google/uuid"
)

type QuizParam struct {
	QuizId uuid.UUID `json:"quiz_id" validate:"required,uuid"`
}

type QuizDto struct {
	Id        uuid.UUID     `json:"id" db:"id"`
	Theme     string        `json:"theme" db:"theme"`
	Title     string        `json:"title" db:"title"`
	UserId    uuid.UUID     `json:"user_id" db:"user_id"`
	QuizCode  string        `json:"quiz_code" db:"quiz_code"`
	Questions []QuestionDto `json:"questions" db:"questions"`
}

type QuestionDto struct {
	Id      uuid.UUID   `json:"id" db:"id"`
	QuizId  uuid.UUID   `json:"quiz_id" db:"quiz_id"`
	Score   int         `json:"score" db:"score"`
	Text    string      `json:"text" db:"text"`
	Image   string      `json:"image" db:"image"`
	Options []OptionDto `json:"options" db:"options"`
}

type OptionDto struct {
	Id         uuid.UUID `json:"id" db:"id"`
	QuestionId uuid.UUID `json:"question_id" db:"question_id"`
	Text       string    `json:"text" db:"text"`
	Image      string    `json:"image" db:"image"`
}

type CreateQuiz struct {
	Theme     string                      `json:"theme"`
	Title     string                      `json:"title"`
	Questions []CreateQuestionWithOptions `json:"questions"`
}

type CreateQuestionWithOptions struct {
	Score   int            `json:"score"`
	Text    string         `json:"text"`
	Options []CreateOption `json:"options"`
}

type CreateOption struct {
	IsCorrect bool   `json:"is_correct"`
	Text      string `json:"text"`
}
