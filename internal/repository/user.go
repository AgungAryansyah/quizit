package repository

import (
	"quizit-be/model/entity"

	"github.com/jmoiron/sqlx"
)

type IUserRepository interface {
	CreateUser(user *entity.User) error
}

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) IUserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) CreateUser(user *entity.User) error {
	query := `INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)`
	_, err := r.db.Exec(query, user.Id, user.Name, user.Email, user.Password)

	if err != nil {
		return err
	}

	return nil
}
