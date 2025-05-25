package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"

	"github.com/google/uuid"
)

type IQuizService interface {
	GetAllQuizzes(page, pageSize int) (quiz *[]entity.Quiz, err error)
	GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *dto.QuizDto, err error)
	CreateQuiz(createQuiz *dto.CreateQuiz, userId uuid.UUID) (quiz *entity.Quiz, err error)
}

type QuizService struct {
	QuizRepository repository.IQuizRepository
	UserRepository repository.IUserRepository
}

func NewQuizService(QuizRepository repository.IQuizRepository, UserRepository repository.IUserRepository) IQuizService {
	return &QuizService{
		QuizRepository: QuizRepository,
		UserRepository: UserRepository,
	}
}

func (s *QuizService) GetAllQuizzes(page, pageSize int) (quiz *[]entity.Quiz, err error) {
	return s.QuizRepository.GetAllQuizzes(page, pageSize)
}

func (s *QuizService) GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *dto.QuizDto, err error) {
	return s.QuizRepository.GetQuizWithQuestionAndOption(quizId)
}

func (s *QuizService) CreateQuiz(createQuiz *dto.CreateQuiz, userId uuid.UUID) (quiz *entity.Quiz, err error) {
	quiz = &entity.Quiz{
		Id:     uuid.New(),
		Theme:  createQuiz.Theme,
		Title:  createQuiz.Title,
		UserId: userId,
	}

	err = s.QuizRepository.CreateQuiz(quiz)
	if err != nil {
		return nil, err
	}

	return quiz, nil
}
