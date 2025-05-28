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

func (h *Handler) CreateQuiz(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	var createQuiz dto.CreateQuiz
	if err := ctx.BodyParser(&createQuiz); err != nil {
		return &response.BadRequest
	}

	res, err := h.service.QuizService.CreateQuiz(&createQuiz, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", res)
}

func (h *Handler) GetQuiz(ctx *fiber.Ctx) error {
	quizCode := ctx.Params("code")
	if len(quizCode) != 6 {
		return &response.BadRequest
	}

	quizId, err := h.service.QuizService.GetQuizByCode(quizCode)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", quizId)
}

func (h *Handler) GetUserQuizzes(ctx *fiber.Ctx) error {
	quizId, err := uuid.Parse(ctx.Params("userId"))
	if err != nil {
		return &response.BadRequest
	}

	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)

	quizes, err := h.service.QuizService.GetUserQuizzes(quizId, page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", quizes)
}
