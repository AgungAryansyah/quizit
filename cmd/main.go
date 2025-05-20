package main

import (
	"quizit-be/pkg/env"
	"quizit-be/pkg/fiber"
	"quizit-be/pkg/postgres"
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

	app.Listen("127.0.0.1:" + env.APP_PORT)
}
