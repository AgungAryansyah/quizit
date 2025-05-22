package rest

import (
	"quizit-be/internal/service"
	"quizit-be/pkg/env"
	"quizit-be/pkg/middleware"
)

type Handler struct {
	service    *service.Service
	middleware middleware.IMiddleware
	env        *env.Env
}

func NewHandler(service *service.Service, middleware middleware.IMiddleware, env *env.Env) *Handler {
	return &Handler{
		service:    service,
		middleware: middleware,
		env:        env,
	}
}
