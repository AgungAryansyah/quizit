package service

import (
	"quizit-be/internal/repository"
	"quizit-be/pkg/jwt"
)

type Service struct {
	AuthService IAuthService
}

func NewService(repository *repository.Repository, jwt *jwt.IJWT) *Service {
	return &Service{
		AuthService: NewAuthService(repository.UserRepository, repository.AuthRepository, *jwt),
	}
}
