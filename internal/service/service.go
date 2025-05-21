package service

import "quizit-be/internal/repository"

type Service struct {
	AuthService IAuthService
}

func NewService(repository *repository.Repository) *Service {
	return &Service{
		AuthService: NewAuthService(repository.UserRepository, repository.AuthRepository),
	}
}
