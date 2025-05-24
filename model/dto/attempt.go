package dto

import "github.com/google/uuid"

type UserAnswersDto struct {
	UserId  uuid.UUID               `json:"user_id" validate:"required,uuid"`
	QuizId  uuid.UUID               `json:"quiz_id" validate:"required,uuid"`
	Answers map[uuid.UUID]uuid.UUID `json:"answers" validate:"required,answers_map"`
}
