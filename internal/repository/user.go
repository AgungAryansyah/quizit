package repository

import (
	"database/sql"
	"errors"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"quizit-be/pkg/response"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type IUserRepository interface {
	CreateUser(user *entity.User) error
	GetUserByEmail(email string) (user *entity.User, err error)
	GetUser(userId uuid.UUID) (user *entity.User, err error)
	GetProfile(userId uuid.UUID) (user *dto.UserDto, err error)
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

	var pgErr *pq.Error
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return &response.DuplicateAccount
	}

	return err
}

func (r *UserRepository) GetUser(userId uuid.UUID) (user *entity.User, err error) {
	user = &entity.User{}
	query := `SELECT * FROM users WHERE id = $1`
	err = r.db.Get(user, query, userId)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.UserNotFound
	}

	return user, err
}

func (r *UserRepository) GetProfile(userId uuid.UUID) (user *dto.UserDto, err error) {
	user = &dto.UserDto{}
	query := `SELECT id, name, profile_picture, email FROM users WHERE id = $1`
	err = r.db.Get(user, query, userId)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.UserNotFound
	}

	return user, err
}

func (r *UserRepository) GetUserByEmail(email string) (user *entity.User, err error) {
	user = &entity.User{}
	query := `SELECT * FROM users WHERE email = $1`
	err = r.db.Get(user, query, email)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.UserNotFound
	}

	return user, err
}
