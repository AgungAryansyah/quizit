package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type IAuthService interface {
	Register(register *dto.Register) error
}

type AuthService struct {
	UserRepository repository.IUserRepository
	AuthRepository repository.IAuthRepository
}

func NewAuthService(UserRepository repository.IUserRepository, AuthRepository repository.IAuthRepository) IAuthService {
	return &AuthService{
		UserRepository: UserRepository,
		AuthRepository: AuthRepository,
	}
}

func (s *AuthService) Register(register *dto.Register) error {
	hasedPassword, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &entity.User{
		Id:       uuid.New(),
		Name:     register.Name,
		Email:    register.Email,
		Password: string(hasedPassword),
	}

	if err := s.UserRepository.CreateUser(user); err != nil {
		return err
	}

	return nil
}
