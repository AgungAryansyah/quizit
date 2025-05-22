package main

import (
	"quizit-be/internal/handler/rest"
	"quizit-be/internal/repository"
	"quizit-be/internal/service"
	"quizit-be/pkg/env"
	"quizit-be/pkg/fiber"
	"quizit-be/pkg/jwt"
	"quizit-be/pkg/middleware"
	"quizit-be/pkg/postgres"
	"quizit-be/pkg/routes"
)

func main() {
	env, err := env.Load()
	if err != nil {
		panic(err)
	}

	app := fiber.Start()

	_, err = postgres.Connect(*env)
	if err != nil {
		panic(err)
	}

	db, err := postgres.Connect(*env)
	if err != nil {
		panic(err)
	}

	jwt := jwt.NewJwt(*env)
	middleware := middleware.NewMiddleware(jwt)

	repository := repository.NewRepository(db)
	service := service.NewService(repository, &jwt)
	handler := rest.NewHandler(service, middleware, env)

	route := routes.NewRoute(app, *handler)
	if err := route.RegisterRoutes(env.APP_PORT); err != nil {
		panic(err)
	}
}
