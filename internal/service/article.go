package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"

	"github.com/google/uuid"
)

type IArticleServie interface {
	GetArticle(articleId uuid.UUID) (article *dto.ArticleDto, err error)
	GetArticles(page, pageSize int) (articles *[]entity.Article, err error)
	CreateArticle(create *dto.CreateArticle, userId uuid.UUID) (articleId *uuid.UUID, err error)
}

type ArticleServie struct {
	ArticleRepository repository.IArticleRepository
	UserRepository    repository.IUserRepository
}

func NewArticleServie(ArticleRepository repository.IArticleRepository, UserRepository repository.IUserRepository) IArticleServie {
	return &ArticleServie{
		ArticleRepository: ArticleRepository,
		UserRepository:    UserRepository,
	}
}

func (s *ArticleServie) GetArticle(articleId uuid.UUID) (articleRes *dto.ArticleDto, err error) {
	article, err := s.ArticleRepository.GetArticle(articleId)
	if err != nil {
		return nil, err
	}

	user, err := s.UserRepository.GetUser(article.UserId)
	if err != nil {
		return nil, err
	}

	return &dto.ArticleDto{
		UserName: user.Name,
		Title:    article.Title,
		Text:     article.Text,
	}, nil
}

func (s *ArticleServie) GetArticles(page, pageSize int) (articles *[]entity.Article, err error) {
	return s.ArticleRepository.GetArticles(page, pageSize)
}

func (s *ArticleServie) CreateArticle(create *dto.CreateArticle, userId uuid.UUID) (articleId *uuid.UUID, err error) {
	id := uuid.New()
	article := &entity.Article{
		Id:     id,
		UserId: userId,
		Title:  create.Title,
		Text:   create.Text,
	}

	err = s.ArticleRepository.CreateArticle(article)
	if err != nil {
		return nil, err
	}

	return &id, nil
}
