package repository

import (
	"database/sql"
	"errors"
	"quizit-be/model/entity"
	"quizit-be/pkg/response"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type IArticleRepository interface {
	GetArticle(articleId uuid.UUID) (article *entity.Article, err error)
	GetArticles(page, pageSize int) (articles *[]entity.Article, err error)
	CreateArticle(article *entity.Article) error
}

type ArticleRepository struct {
	db *sqlx.DB
}

func NewArticleRepository(db *sqlx.DB) IArticleRepository {
	return &ArticleRepository{
		db: db,
	}
}

func (r *ArticleRepository) GetArticle(articleId uuid.UUID) (article *entity.Article, err error) {
	article = &entity.Article{}
	query := `SELECT * FROM articles WHERE id = $1`
	err = r.db.Get(article, query, articleId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.ArticleNotFound
		}
		return nil, err
	}

	return article, err
}

func (r *ArticleRepository) GetArticles(page, pageSize int) (articles *[]entity.Article, err error) {
	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	articles = &[]entity.Article{}
	query := `SELECT * FROM articles LIMIT $1 OFFSET $2`
	err = r.db.Select(articles, query, pageSize, offset)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.ArticleNotFound
		}
		return nil, err
	}

	return articles, err
}

func (r *ArticleRepository) CreateArticle(article *entity.Article) error {
	query := `
		INSERT INTO articles (id, user_id, title, text)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.Exec(query, article.Id, article.UserId, article.Title, article.Text)
	return err
}
