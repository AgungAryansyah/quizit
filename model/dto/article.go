package dto

import "github.com/google/uuid"

type CreateArticle struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type ArticleDto struct {
	UserName string `json:"user_name" db:"user_name"`
	Title    string `json:"title" db:"title"`
	Text     string `json:"text" db:"text"`
}

type EditArticle struct {
	Id    uuid.UUID `json:"id"`
	Title string    `json:"title"`
	Text  string    `json:"text"`
}
