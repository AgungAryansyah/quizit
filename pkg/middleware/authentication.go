package middleware

import (
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
)

func (m *Middleware) Authentication(ctx *fiber.Ctx) error {
	authToken := ctx.Cookies("token")

	if len(authToken) < 1 {
		return &response.InvalidToken
	}

	id, _, err := m.jwt.ValidateToken(authToken)
	if err != nil {
		return &response.InvalidToken
	}
	ctx.Locals("userId", id)

	return ctx.Next()
}
