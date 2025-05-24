package dto

import (
	"github.com/google/uuid"
)

type QuizParam struct {
	QuizId uuid.UUID `json:"quiz_id" validate:"required,uuid"`
}

type CreateAttempt struct {
	UserId     uuid.UUID `json:"user_id" validate:"required,uuid"`
	QuizId     uuid.UUID `json:"quiz_id" validate:"required,uuid"`
	TotalScore int       `json:"total_score" validate:"required,min=1"`
}

type QuizDto struct {
	QuizId    uuid.UUID     `json:"quiz_id"`
	Theme     string        `json:"theme"`
	Title     string        `json:"title"`
	Questions []QuestionDto `json:"questions"`
}

type QuestionDto struct {
	QuestionId    uuid.UUID   `json:"question_id"`
	QuestionText  string      `json:"question_text"`
	QuestionImage string      `json:"question_image"`
	Options       []OptionDto `json:"options"`
}

type OptionDto struct {
	OptionId    uuid.UUID `json:"option_id"`
	OptionText  string    `json:"option_text"`
	OptionImage string    `json:"option_image"`
}
