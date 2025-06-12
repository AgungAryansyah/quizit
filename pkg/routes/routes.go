package routes

import (
	"quizit-be/internal/handler/rest"
	"quizit-be/pkg/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
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

	mountAuth(routerGroup, r.handler, r.middleware)
	mountQuiz(routerGroup, r.handler, r.middleware)
	mountAttempt(routerGroup, r.handler, r.middleware)
	mountUser(routerGroup, r.handler, r.middleware)
	mountArtice(routerGroup, r.handler, r.middleware)

	r.app.Get("/swagger/*", swagger.HandlerDefault)

	return r.app.Listen(":" + port)
}

func mountAuth(routerGroup fiber.Router, handler rest.Handler, middleware middleware.IMiddleware) {
	auth := routerGroup.Group("/auths")

	auth.Post("/register", handler.Register)
	auth.Post("/login", handler.Login)
	auth.Post("/logout", middleware.Authentication, handler.Logout)
	auth.Post("/refresh", handler.RefreshToken)
}

func mountQuiz(routerGroup fiber.Router, handler rest.Handler, middleware middleware.IMiddleware) {
	quiz := routerGroup.Group("/quizzes")

	quiz.Get("/", middleware.Authentication, handler.GetAllQuizzes)
	quiz.Get("/:id/questions/options", middleware.Authentication, handler.GetQuizWithQuestionAndOption)
	quiz.Post("/", middleware.Authentication, handler.CreateQuiz)
	quiz.Get("/:code", middleware.Authentication, handler.GetQuiz)
	quiz.Get("/users/:userId", middleware.Authentication, handler.GetUserQuizzes)
	quiz.Delete("/:quizId", middleware.Authentication, handler.DeleteQuiz)
}

func mountAttempt(routerGroup fiber.Router, handler rest.Handler, middleware middleware.IMiddleware) {
	quiz := routerGroup.Group("/attempts")

	quiz.Post("/", middleware.Authentication, handler.CreateAttempt)
	quiz.Get("/user", middleware.Authentication, handler.GetUserAttempt)
	quiz.Get("/quiz/:quizId", middleware.Authentication, handler.GetQuizAttempt)
}

func mountUser(routerGroup fiber.Router, handler rest.Handler, middleware middleware.IMiddleware) {
	user := routerGroup.Group("/users")

	user.Get("/", middleware.Authentication, handler.GetMe)
}

func mountArtice(routerGroup fiber.Router, handler rest.Handler, middleware middleware.IMiddleware) {
	article := routerGroup.Group("/articles")

	article.Get("/users", middleware.Authentication, handler.GetUserArticles)
	article.Get("/:id", middleware.Authentication, handler.GetArticle)
	article.Post("/", middleware.Authentication, handler.CreateArticle)
	article.Get("/", middleware.Authentication, handler.SearchArticles)
	article.Delete("/:id", middleware.Authentication, handler.DeleteArticle)
	article.Patch("/", middleware.Authentication, handler.EditArticle)
}
