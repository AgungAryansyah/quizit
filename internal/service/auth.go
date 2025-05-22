package service

import (
	"crypto/rand"
	"encoding/base64"
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"quizit-be/pkg/jwt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type IAuthService interface {
	Register(register *dto.Register) error
	Login(login *dto.LoginReq, expiry int) (res *dto.LoginRes, err error)
	ReplaceToken(token string, expiry int) (res *dto.LoginRes, err error)
}

type AuthService struct {
	UserRepository repository.IUserRepository
	AuthRepository repository.IAuthRepository
	jwt            jwt.IJWT
}

func NewAuthService(UserRepository repository.IUserRepository, AuthRepository repository.IAuthRepository, jwt jwt.IJWT) IAuthService {
	return &AuthService{
		UserRepository: UserRepository,
		AuthRepository: AuthRepository,
		jwt:            jwt,
	}
}

func (s *AuthService) Register(register *dto.Register) error {
	hasedPassword, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &entity.User{
		Id:             uuid.New(),
		Name:           register.Name,
		ProfilePicture: "",
		Email:          register.Email,
		Password:       string(hasedPassword),
	}

	if err := s.UserRepository.CreateUser(user); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) Login(login *dto.LoginReq, expiry int) (res *dto.LoginRes, err error) {
	user, err := s.UserRepository.GetUserByEmail(login.Email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password))
	if err != nil {
		return nil, err
	}

	token, err := s.jwt.GenerateToken(user.Id, user.RoleId)
	if err != nil {
		return nil, err
	}

	refreshToken, err := generateRefreshToken(64)
	if err != nil {
		return nil, err
	}

	session := &entity.Session{
		UserId:    user.Id,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(time.Duration(expiry) * time.Second),
	}

	_ = s.AuthRepository.DeleteSession(user.Id)

	if err := s.AuthRepository.StoreSession(session); err != nil {
		return nil, err
	}

	return &dto.LoginRes{
		Token:        token,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) ReplaceToken(token string, expiry int) (res *dto.LoginRes, err error) {
	session, err := s.AuthRepository.GetSessionByToken(token)
	if err != nil {
		return nil, err
	}

	user, err := s.UserRepository.GetUser(session.UserId)
	if err != nil {
		return nil, err
	}

	token, err = s.jwt.GenerateToken(user.Id, user.RoleId)
	if err != nil {
		return nil, err
	}

	refreshToken, err := generateRefreshToken(64)
	if err != nil {
		return nil, err
	}

	err = s.AuthRepository.ReplaceToken(user.Id, refreshToken, time.Now().Add(time.Duration(expiry)*time.Second))
	if err != nil {
		return nil, err
	}

	return &dto.LoginRes{
		Token:        token,
		RefreshToken: refreshToken,
	}, nil
}

func generateRefreshToken(length int) (string, error) {
	bytes := make([]byte, length*3/4)

	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	token := base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(bytes)

	if len(token) > length {
		token = token[:length]
	}
	return token, nil
}
