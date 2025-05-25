package fiber

import (
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func Start() *fiber.App {
	app := fiber.New(
		fiber.Config{
			ErrorHandler: response.CustomErrorHandler,
		},
	)

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*", //should be updated for prod
		AllowMethods:     "GET, POST, DELETE, PATCH, PUT",
		AllowHeaders:     "Content-Type, Authorization, X-Requested-With",
		AllowCredentials: true,
	}))
	return app
}
