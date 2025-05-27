package dto

type CreateArticle struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type ArticleDto struct {
	UserName string `json:"user_name" db:"user_name"`
	Title    string `json:"title" db:"title"`
	Text     string `json:"text" db:"text"`
}
