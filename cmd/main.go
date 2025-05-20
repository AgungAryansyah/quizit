package main

import (
	"quizit-be/pkg/env"
	fiber "quizit-be/pkg/fiber"
)

func main() {
	env, err := env.Load()
	if err != nil {
		panic(err)
	}

	app := fiber.Start()

	app.Listen("127.0.0.1:" + env.AppPort)
}
