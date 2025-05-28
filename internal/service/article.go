package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"

	"github.com/google/uuid"
)

type IArticleServie interface {
	GetArticle(articleId uuid.UUID) (article *dto.ArticleDto, err error)
	CreateArticle(create *dto.CreateArticle, userId uuid.UUID) (articleId *uuid.UUID, err error)
	SearchArticles(keyword string, page, pageSize int) (articles *[]entity.Article, err error)
	GetUserArticles(userId uuid.UUID, page, pageSize int) (articles *[]entity.Article, err error)
	DeleteArticle(articleId uuid.UUID, userId uuid.UUID) error
	EditArticle(edit *dto.EditArticle, userId uuid.UUID) error
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

func (s *ArticleServie) SearchArticles(keyword string, page, pageSize int) (articles *[]entity.Article, err error) {
	return s.ArticleRepository.SearchArticles(keyword, page, pageSize)
}

func (s *ArticleServie) GetUserArticles(userId uuid.UUID, page, pageSize int) (articles *[]entity.Article, err error) {
	return s.ArticleRepository.GetUserArticles(userId, page, pageSize)
}

func (s *ArticleServie) DeleteArticle(articleId uuid.UUID, userId uuid.UUID) error {
	return s.ArticleRepository.DeleteArticle(articleId, userId)
}

func (s *ArticleServie) EditArticle(edit *dto.EditArticle, userId uuid.UUID) error {
	return s.ArticleRepository.EditArticle(edit, userId)
}
