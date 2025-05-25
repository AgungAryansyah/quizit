package dto

import "github.com/google/uuid"

type UserDto struct {
	Id             uuid.UUID `json:"user_id" db:"id"`
	Name           string    `json:"name" db:"name"`
	ProfilePicture string    `json:"profile_picture" db:"profile_picture"`
	Email          string    `json:"email" db:"email"`
}
