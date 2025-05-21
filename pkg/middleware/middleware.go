package middleware

import (
	"quizit-be/pkg/jwt"

	"github.com/gofiber/fiber/v2"
)

type IMiddleware interface {
	Authentication(*fiber.Ctx) error
	AdminOnly(*fiber.Ctx) error
}

type Middleware struct {
	jwt jwt.JWTItf
}

func NewMiddleware(jwt jwt.JWTItf) IMiddleware {
	return &Middleware{
		jwt: jwt,
	}
}
