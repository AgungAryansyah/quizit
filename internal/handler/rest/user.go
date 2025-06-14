package rest

import (
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// @summary Get my account
// @tags User
// @produce json
// @router /users [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) GetMe(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	user, err := h.service.UserService.GetMe(userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", user)
}
