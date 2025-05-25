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

	quiz, err := h.service.QuizService.CreateQuiz(&createQuiz, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", quiz)
}

func (h *Handler) CreateQuestion(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	var createQuestion dto.CreateQuestion
	if err := ctx.BodyParser(&createQuestion); err != nil {
		return &response.BadRequest
	}

	question, err := h.service.QuizService.CreateQuestion(&createQuestion, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", question)
}

func (h *Handler) CreateOption(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	var createOption dto.CreateOption
	if err := ctx.BodyParser(&createOption); err != nil {
		return &response.BadRequest
	}

	option, err := h.service.QuizService.CreateOption(&createOption, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", option)
}
