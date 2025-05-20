package env

import (
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	AppPort string
}

func Load() (*Env, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	env := &Env{
		AppPort: os.Getenv("APP_PORT"),
	}

	return env, nil
}
