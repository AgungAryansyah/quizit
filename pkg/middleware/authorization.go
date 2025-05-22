package middleware

import (
	"quizit-be/pkg/response"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func (m *Middleware) AdminOnly(ctx *fiber.Ctx) error {
	authToken := ctx.GetReqHeaders()["Authorization"]

	if len(authToken) < 1 {
		return &response.InvalidToken
	}

	bearerToker := authToken[0]
	token := strings.Split(bearerToker, " ")

	id, RoleId, err := m.jwt.ValidateToken(token[1])
	if err != nil {
		return &response.InvalidToken
	}

	if RoleId != 1 {
		return &response.Forbidden
	}

	ctx.Locals("userId", id)

	return ctx.Next()
}
