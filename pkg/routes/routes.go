package routes

import (
	"quizit-be/internal/handler/rest"
	"quizit-be/pkg/middleware"

	"github.com/gofiber/fiber/v2"
)

type Route struct {
	app        *fiber.App
	handler    rest.Handler
	middleware middleware.IMiddleware
}

func NewRoute(app *fiber.App, handler rest.Handler, middleware middleware.IMiddleware) *Route {
	return &Route{
		app:        app,
		handler:    handler,
		middleware: middleware,
	}
}

func (r *Route) RegisterRoutes(port string) error {
	routerGroup := r.app.Group("/api/v1")

	mountAuth(routerGroup, r.handler)
	mountQuiz(routerGroup, r.handler, r.middleware)

	return r.app.Listen(":" + port)
}

func mountAuth(routerGroup fiber.Router, handler rest.Handler) {
	auth := routerGroup.Group("/auths")

	auth.Post("/register", handler.Register)
	auth.Post("/login", handler.Login)
	auth.Post("/refresh", handler.RefreshTokenn)
}

func mountQuiz(routerGroup fiber.Router, handler rest.Handler, middleware middleware.IMiddleware) {
	quiz := routerGroup.Group("/quizzes")

	quiz.Get("/", middleware.Authentication, handler.GetAllQuizzes)
	quiz.Get("/:id/questions/options", middleware.Authentication, handler.GetQuizWithQuestionAndOption)
	quiz.Post("/attempts", middleware.Authentication, handler.CreateAttempt)
}
