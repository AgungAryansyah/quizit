package dto

import "github.com/google/uuid"

type UserAnswersDto struct {
	Id      uuid.UUID               `json:"quiz_id" validate:"required" binding:"required" example:"11111111-1111-1111-1111-111111111111"`
	Answers map[uuid.UUID]uuid.UUID `json:"answers" validate:"required,answers_map" binding:"required"`
}

type CreateAttemptReq struct {
	UserId     uuid.UUID `json:"user_id" validate:"required,uuid"`
	QuizId     uuid.UUID `json:"quiz_id" validate:"required,uuid"`
	TotalScore int       `json:"total_score" validate:"required,min=1"`
}
