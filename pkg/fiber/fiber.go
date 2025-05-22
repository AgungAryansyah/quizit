package fiber

import (
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
)

func Start() *fiber.App {
	app := fiber.New(
		fiber.Config{
			ErrorHandler: response.CustomErrorHandler,
		},
	)
	return app
}
