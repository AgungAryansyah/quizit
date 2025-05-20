package main

import fiber "quizit-be/pkg/fiber"

func main() {
	app := fiber.Start()

	app.Listen("127.0.0.1:8080")
}
