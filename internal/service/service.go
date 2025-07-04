package service

import (
	"quizit-be/internal/repository"
	"quizit-be/pkg/jwt"
)

type Service struct {
	AuthService    IAuthService
	UserService    IUserService
	QuizService    IQuizService
	AttemptService IAttemptService
	ArticleService IArticleService
}

func NewService(repository *repository.Repository, jwt *jwt.IJWT) *Service {
	return &Service{
		AuthService:    NewAuthService(repository.UserRepository, repository.AuthRepository, *jwt),
		UserService:    NewUserService(repository.UserRepository),
		QuizService:    NewQuizService(repository.QuizRepository, repository.UserRepository),
		AttemptService: NewAttemptService(repository.AttemptRepository, repository.QuizRepository),
		ArticleService: NewArticleService(repository.ArticleRepository, repository.UserRepository),
	}
}
