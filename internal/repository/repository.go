package repository

import "github.com/jmoiron/sqlx"

type Repository struct {
	AuthRepository    IAuthRepository
	UserRepository    IUserRepository
	QuizRepository    IQuizRepository
	AttemptRepository IAttemptRepository
	ArticleRepository IArticleRepository
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		AuthRepository:    NewAuthRepository(db),
		UserRepository:    NewUserRepository(db),
		QuizRepository:    NewQuizRepository(db),
		AttemptRepository: NewAttemptRepository(db),
		ArticleRepository: NewArticleRepository(db),
	}
}
