package response

import "github.com/gofiber/fiber/v2"

func HttpSuccess(ctx *fiber.Ctx, msg string, payload ...any) error {
	return ctx.JSON(fiber.Map{
		"message": msg,
		"payload": payload,
	})
}

func HttpError(ctx *fiber.Ctx, code int, msg string, err error) error {
	return ctx.Status(code).JSON(fiber.Map{
		"message": msg,
		"error":   err,
	})
}
