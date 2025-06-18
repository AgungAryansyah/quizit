package main

import (
	"os"
	_ "quizit-be/docs"
	"quizit-be/internal/handler/rest"
	"quizit-be/internal/repository"
	"quizit-be/internal/service"
	"quizit-be/pkg/env"
	"quizit-be/pkg/fiber"
	"quizit-be/pkg/jwt"
	"quizit-be/pkg/middleware"
	"quizit-be/pkg/postgres"
	"quizit-be/pkg/routes"
	"quizit-be/pkg/validator"
)

// @title Quizit
// @version 1.0
// @host localhost:8081
// @basePath /api/v1
func main() {
	err := env.Load()
	if err != nil {
		panic(err)
	}

	app := fiber.Start()

	db, err := postgres.Connect()
	if err != nil {
		panic(err)
	}

	jwt := jwt.NewJwt()
	middleware := middleware.NewMiddleware(jwt)
	validator := validator.NewValidator()

	repository := repository.NewRepository(db)
	service := service.NewService(repository, &jwt)
	handler := rest.NewHandler(service, middleware, validator)

	route := routes.NewRoute(app, *handler, middleware)
	if err := route.RegisterRoutes(os.Getenv("APP_PORT")); err != nil {
		panic(err)
	}
}
