package rest

import (
	"quizit-be/internal/service"
	"quizit-be/pkg/middleware"
)

type Handler struct {
	service    *service.Service
	middleware middleware.IMiddleware
}

func NewHandler(service *service.Service, middleware middleware.IMiddleware) *Handler {
	return &Handler{
		service:    service,
		middleware: middleware,
	}
}
