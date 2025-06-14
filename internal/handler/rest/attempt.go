package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// @summary User attempts a quiz
// @tags Attempt
// @produce json
// @param answers body dto.UserAnswersDto true "User anser request body"
// @router /attempts [post]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
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

// @summary Get user's attempt
// @tags Attempt
// @produce json
// @router /attempts/users [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
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

// @summary Get attempts from a quiz
// @tags Attempt
// @produce json
// @param quizId path string true "Quiz ID"
// @router /attempts/quizes [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
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
