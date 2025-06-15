package dto

import "github.com/google/uuid"

type CreateArticleReq struct {
	Title string `json:"title" validate:"required" binding:"required" example:"Article title"`
	Text  string `json:"text" validate:"required" binding:"required" example:"Article content"`
}

type ArticleDto struct {
	UserName string `json:"user_name" db:"user_name"`
	Title    string `json:"title" db:"title"`
	Text     string `json:"text" db:"text"`
}

type EditArticleReq struct {
	Id    uuid.UUID `json:"id" validate:"required,uuid" binding:"required" example:"11111111-1111-1111-1111-111111111111"`
	Title string    `json:"title" validate:"required" binding:"required" example:"Edited article title"`
	Text  string    `json:"text" validate:"required" binding:"required" example:"Edited article content"`
}
