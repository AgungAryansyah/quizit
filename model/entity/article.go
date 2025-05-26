package entity

import "github.com/google/uuid"

type Article struct {
	Id     uuid.UUID `json:"id" db:"id"`
	UserId uuid.UUID `json:"user_id" db:"user_id"`
	Title  string    `json:"title" db:"title"`
	Text   string    `json:"text" db:"text"`
}
