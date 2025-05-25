package rest

import (
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

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
