package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (h *Handler) GetAllQuizzes(ctx *fiber.Ctx) error {
	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)

	quizes, err := h.service.QuizService.GetAllQuizzes(page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", quizes)
}

func (h *Handler) GetQuizWithQuestionAndOption(ctx *fiber.Ctx) error {
	quizId, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return &response.BadRequest
	}

	quiz, err := h.service.QuizService.GetQuizWithQuestionAndOption(quizId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", quiz)
}

func (h *Handler) CreateAttempt(ctx *fiber.Ctx) error {
	var answers dto.UserAnswersDto
	if err := ctx.BodyParser(&answers); err != nil {
		return &response.BadRequest
	}

	attempt, err := h.service.QuizService.CreateAttempt(answers)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", attempt)
}
