package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/entity"

	"github.com/google/uuid"
)

type IArticleServie interface {
	GetArticle(articleId uuid.UUID) (article *entity.Article, err error)
	GetArticles(page, pageSize int) (articles *[]entity.Article, err error)
}

type ArticleServie struct {
	ArticleRepository repository.IArticleRepository
}

func NewArticleServie(ArticleRepository repository.IArticleRepository) IArticleServie {
	return &ArticleServie{
		ArticleRepository: ArticleRepository,
	}
}

func (s *ArticleServie) GetArticle(articleId uuid.UUID) (article *entity.Article, err error) {
	return s.ArticleRepository.GetArticle(articleId)
}

func (s *ArticleServie) GetArticles(page, pageSize int) (articles *[]entity.Article, err error) {
	return s.ArticleRepository.GetArticles(page, pageSize)
}
