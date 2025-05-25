package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"

	"github.com/google/uuid"
)

type IUserService interface {
	GetMe(userId uuid.UUID) (user *dto.UserDto, err error)
}

type UserService struct {
	UserRepository repository.IUserRepository
}

func NewUserService(UserRepository repository.IUserRepository) IUserService {
	return &UserService{
		UserRepository: UserRepository,
	}
}

func (s *UserService) GetMe(userId uuid.UUID) (user *dto.UserDto, err error) {
	return s.UserRepository.GetProfile(userId)
}
