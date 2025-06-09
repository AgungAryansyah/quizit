package dto

import "github.com/google/uuid"

type CreateArticle struct {
	Title string `json:"title" validate:"required"`
	Text  string `json:"text" validate:"required"`
}

type ArticleDto struct {
	UserName string `json:"user_name" db:"user_name"`
	Title    string `json:"title" db:"title"`
	Text     string `json:"text" db:"text"`
}

type EditArticle struct {
	Id    uuid.UUID `json:"id" validate:"required,uuid"`
	Title string    `json:"title" validate:"required"`
	Text  string    `json:"text" validate:"required"`
}
