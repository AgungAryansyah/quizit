package dto

import "github.com/google/uuid"

type UserAnswersDto struct {
	QuizCode string                  `json:"quiz_code" validate:"required"`
	Answers  map[uuid.UUID]uuid.UUID `json:"answers" validate:"required,answers_map"`
}

type CreateAttempt struct {
	UserId     uuid.UUID `json:"user_id" validate:"required,uuid"`
	QuizId     uuid.UUID `json:"quiz_id" validate:"required,uuid"`
	TotalScore int       `json:"total_score" validate:"required,min=1"`
}
