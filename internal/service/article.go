package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"

	"github.com/google/uuid"
)

type IArticleService interface {
	GetArticle(articleId uuid.UUID) (article *dto.ArticleDto, err error)
	CreateArticle(create *dto.CreateArticleReq, userId uuid.UUID) (articleId *uuid.UUID, err error)
	SearchArticles(keyword string, page, pageSize int) (articles *[]entity.Article, err error)
	GetUserArticles(userId uuid.UUID, page, pageSize int) (articles *[]entity.Article, err error)
	DeleteArticle(articleId uuid.UUID, userId uuid.UUID) error
	EditArticle(edit *dto.EditArticleReq, userId uuid.UUID) error
}

type ArticleService struct {
	ArticleRepository repository.IArticleRepository
	UserRepository    repository.IUserRepository
}

func NewArticleService(ArticleRepository repository.IArticleRepository, UserRepository repository.IUserRepository) IArticleService {
	return &ArticleService{
		ArticleRepository: ArticleRepository,
		UserRepository:    UserRepository,
	}
}

func (s *ArticleService) GetArticle(articleId uuid.UUID) (articleRes *dto.ArticleDto, err error) {
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

func (s *ArticleService) CreateArticle(create *dto.CreateArticleReq, userId uuid.UUID) (articleId *uuid.UUID, err error) {
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

func (s *ArticleService) SearchArticles(keyword string, page, pageSize int) (articles *[]entity.Article, err error) {
	return s.ArticleRepository.SearchArticles(keyword, page, pageSize)
}

func (s *ArticleService) GetUserArticles(userId uuid.UUID, page, pageSize int) (articles *[]entity.Article, err error) {
	return s.ArticleRepository.GetUserArticles(userId, page, pageSize)
}

func (s *ArticleService) DeleteArticle(articleId uuid.UUID, userId uuid.UUID) error {
	return s.ArticleRepository.DeleteArticle(articleId, userId)
}

func (s *ArticleService) EditArticle(edit *dto.EditArticleReq, userId uuid.UUID) error {
	return s.ArticleRepository.EditArticle(edit, userId)
}
