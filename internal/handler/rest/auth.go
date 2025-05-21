package rest

import (
	"quizit-be/model/dto"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) Register(ctx *fiber.Ctx) error {
	var register dto.Register
	if err := ctx.BodyParser(&register); err != nil {
		return err
	}

	if err := h.service.AuthService.Register(&register); err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{
		"message": "success",
		"payload": nil,
	})
}

//todo: add error handler and validator
