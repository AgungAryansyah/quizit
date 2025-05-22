package repository

import (
	"quizit-be/model/entity"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type IUserRepository interface {
	CreateUser(user *entity.User) error
	GetUserByEmail(email string) (user *entity.User, err error)
	GetUser(userId uuid.UUID) (user *entity.User, err error)
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
	query := `INSERT INTO users (id, name, profile_picture, email, password) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.db.Exec(query, user.Id, user.Name, "", user.Email, user.Password)

	if err != nil {
		return err
	}

	return nil
}

func (r *UserRepository) GetUser(userId uuid.UUID) (user *entity.User, err error) {
	user = &entity.User{}
	query := `SELECT * FROM users WHERE id = $1`
	err = r.db.Get(user, query, userId)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetUserByEmail(email string) (user *entity.User, err error) {
	user = &entity.User{}
	query := `SELECT * FROM users WHERE email = $1`
	err = r.db.Get(user, query, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}
