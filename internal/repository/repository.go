package repository

import "github.com/jmoiron/sqlx"

type Repository struct {
	AuthRepository IAuthRepository
	UserRepository IUserRepository
	QuizRepository IQuizRepository
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		AuthRepository: NewAuthRepository(db),
		UserRepository: NewUserRepository(db),
		QuizRepository: NewQuizRepository(db),
	}
}
