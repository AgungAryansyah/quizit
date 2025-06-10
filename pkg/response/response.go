package response

import (
	"quizit-be/model/dto"

	"github.com/gofiber/fiber/v2"
)

func HttpSuccess(ctx *fiber.Ctx, msg string, payload ...any) error {
	return ctx.JSON(dto.HttpSuccess{
		Message: msg,
		Payload: payload,
	})
}

func HttpError(ctx *fiber.Ctx, code int, msg string, err error) error {
	return ctx.Status(code).JSON(dto.HttpError{
		Message: msg,
		Error:   err.Error(),
	})
}
