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
	CreateArticle(article *entity.Article) error
	SearchArticles(keyword string, page, pageSize int) (articles *[]entity.Article, err error)
	GetUserArticles(userId uuid.UUID, page, pageSize int) (articles *[]entity.Article, err error)
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

func (r *ArticleRepository) CreateArticle(article *entity.Article) error {
	query := `
		INSERT INTO articles (id, user_id, title, text)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.Exec(query, article.Id, article.UserId, article.Title, article.Text)
	return err
}

func (r *ArticleRepository) SearchArticles(keyword string, page, pageSize int) (articles *[]entity.Article, err error) {
	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	articles = &[]entity.Article{}
	query := `
		SELECT * FROM articles 
		WHERE
			title ILIKE $1 OR 
			text ILIKE $1 
		LIMIT $2 OFFSET $3
	`
	err = r.db.Select(articles, query, "%"+keyword+"%", pageSize, offset)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.ArticleNotFound
		}
		return nil, err
	}

	return articles, err
}

func (r *ArticleRepository) GetUserArticles(userId uuid.UUID, page, pageSize int) (articles *[]entity.Article, err error) {
	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	articles = &[]entity.Article{}
	query := `SELECT * FROM articles WHERE user_id = $1 LIMIT $2 OFFSET $3`
	err = r.db.Select(articles, query, userId, pageSize, offset)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.ArticleNotFound
		}
		return nil, err
	}

	return articles, err
}
