package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (h *Handler) CreateAttempt(ctx *fiber.Ctx) error {
	var answers dto.UserAnswersDto
	if err := ctx.BodyParser(&answers); err != nil {
		return &response.BadRequest
	}

	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	attempt, err := h.service.AttemptService.CreateAttempt(answers, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", attempt)
}

func (h *Handler) GetUserAttempt(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)

	attempts, err := h.service.AttemptService.GetUserAttempt(userId, page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", attempts)
}

func (h *Handler) GetQuizAttempt(ctx *fiber.Ctx) error {
	quizId, err := uuid.Parse(ctx.Params("quizId"))
	if err != nil {
		return &response.BadRequest
	}

	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)

	attempts, err := h.service.AttemptService.GetQuizAttempt(quizId, page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", attempts)
}
