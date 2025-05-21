package entity

import (
	"github.com/google/uuid"
)

type User struct {
	Id             uuid.UUID `json:"user_id" db:"id"`
	Name           string    `json:"name" db:"name"`
	ProfilePicture string    `json:"profile_picture" db:"profile_picture"`
	Email          string    `json:"email" db:"email"`
	Password       string    `json:"password" db:"password"`
	RoleId         int       `json:"role_id" db:"role_id"`
}
