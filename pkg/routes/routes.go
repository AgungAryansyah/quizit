package routes

import (
	"quizit-be/internal/handler/rest"

	"github.com/gofiber/fiber/v2"
)

type Route struct {
	app     *fiber.App
	handler rest.Handler
}

func NewRoute(app *fiber.App, handler rest.Handler) *Route {
	return &Route{
		app:     app,
		handler: handler,
	}
}

func (r *Route) RegisterRoutes() {
	routerGroup := r.app.Group("/api/v1")

	mountAuth(routerGroup, r.handler)

}

func mountAuth(routerGroup fiber.Router, handler rest.Handler) {
	auth := routerGroup.Group("/auths")

	auth.Post("/register", handler.Register)
}
