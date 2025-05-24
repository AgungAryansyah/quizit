package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) CreateAttempt(ctx *fiber.Ctx) error {
	var answers dto.UserAnswersDto
	if err := ctx.BodyParser(&answers); err != nil {
		return &response.BadRequest
	}

	attempt, err := h.service.AttemptService.CreateAttempt(answers)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", attempt)
}
