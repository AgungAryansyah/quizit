package rest

import (
	"quizit-be/internal/service"
	"quizit-be/pkg/middleware"

	"github.com/go-playground/validator/v10"
)

type Handler struct {
	service    *service.Service
	middleware middleware.IMiddleware
	validator  *validator.Validate
}

func NewHandler(service *service.Service, middleware middleware.IMiddleware, val *validator.Validate) *Handler {
	return &Handler{
		service:    service,
		middleware: middleware,
		validator:  val,
	}
}
