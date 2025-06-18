package env

import (
	"github.com/joho/godotenv"
)

func Load() error {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	return nil
}
