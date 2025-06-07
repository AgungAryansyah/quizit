package rest

import (
	"quizit-be/internal/service"
	"quizit-be/pkg/env"
	"quizit-be/pkg/middleware"

	"github.com/go-playground/validator/v10"
)

type Handler struct {
	service    *service.Service
	middleware middleware.IMiddleware
	env        *env.Env
	validator  *validator.Validate
}

func NewHandler(service *service.Service, middleware middleware.IMiddleware, env *env.Env, val *validator.Validate) *Handler {
	return &Handler{
		service:    service,
		middleware: middleware,
		env:        env,
		validator:  val,
	}
}
