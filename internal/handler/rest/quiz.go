package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// @summary Search a quiz
// @tags Quiz
// @produce json
// @param page 	  query int true     "Page number"
// @param size 	  query int true     "Page size"
// @param keyword query string false "Search Keyword"
// @router /quizzes [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) GetAllQuizzes(ctx *fiber.Ctx) error {
	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)
	keyword := ctx.Query("keyword", "")

	quizes, err := h.service.QuizService.GetAllQuizzes(keyword, page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", quizes)
}

// @summary Get quiz with the questions and option
// @tags Quiz
// @produce json
// @param id path string true "Quiz ID"
// @router /quizzes/{quizId}/questions/options [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
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

// @summary Create a quiz
// @tags Quiz
// @accept json
// @produce json
// @param createQuiz body dto.CreateQuiz true "Create quiz body request"
// @router /quizzes [post]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) CreateQuiz(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	var createQuiz dto.CreateQuiz
	if err := ctx.BodyParser(&createQuiz); err != nil {
		return &response.BadRequest
	}

	if err := h.validator.Struct(createQuiz); err != nil {
		return err
	}

	res, err := h.service.QuizService.CreateQuiz(&createQuiz, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", res)
}

// @summary Get quiz by the quiz code
// @tags Quiz
// @produce json
// @param code path string true "Quiz code"
// @router /quizzes/{code} [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
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

// @summary Get quiz made by the user
// @tags Quiz
// @produce json
// @param userId path string true "User ID"
// @router /quizzes/users [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) GetUserQuizzes(ctx *fiber.Ctx) error {
	userId, err := uuid.Parse(ctx.Params("userId"))
	if err != nil {
		return &response.BadRequest
	}

	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)

	quizes, err := h.service.QuizService.GetUserQuizzes(userId, page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", quizes)
}

// @summary Delete a quiz
// @tags Quiz
// @produce json
// @param quizId path string true "Quiz ID"
// @router /quizzes/{quizId} [delete]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 404 {object} dto.HttpError "Quiz not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) DeleteQuiz(ctx *fiber.Ctx) error {
	quizId, err := uuid.Parse(ctx.Params("quizId"))
	if err != nil {
		return &response.BadRequest
	}

	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	err = h.service.QuizService.DeleteQuiz(quizId, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", nil)
}
