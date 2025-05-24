package service

import (
	"quizit-be/internal/repository"
	"quizit-be/pkg/jwt"
)

type Service struct {
	AuthService    IAuthService
	QuizService    IQuizService
	AttemptService IAttemptService
}

func NewService(repository *repository.Repository, jwt *jwt.IJWT) *Service {
	return &Service{
		AuthService:    NewAuthService(repository.UserRepository, repository.AuthRepository, *jwt),
		QuizService:    NewQuizService(repository.QuizRepository, repository.UserRepository),
		AttemptService: NewAttemptService(repository.AttemptRepository, repository.QuizRepository),
	}
}
