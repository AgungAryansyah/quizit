package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"quizit-be/pkg/response"

	"github.com/google/uuid"
)

type IQuizService interface {
	GetAllQuizzes(page, pageSize int) (quiz *[]entity.Quiz, err error)
	GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *dto.QuizDto, err error)
	CreateQuiz(createQuiz *dto.CreateQuiz, userId uuid.UUID) (quiz *entity.Quiz, err error)
	CreateQuestion(createQuestion *dto.CreateQuestion, userId uuid.UUID) (question *entity.Question, err error)
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

func (s *QuizService) CreateQuestion(createQuestion *dto.CreateQuestion, userId uuid.UUID) (question *entity.Question, err error) {
	quiz, err := s.QuizRepository.GetQuiz(createQuestion.QuizId)
	if err != nil {
		return nil, err
	}

	if quiz.UserId != userId {
		return nil, &response.Forbidden
	}

	question = &entity.Question{
		Id:     uuid.New(),
		QuizId: createQuestion.QuizId,
		Score:  createQuestion.Score,
		Text:   createQuestion.Text,
		Image:  "",
	}

	err = s.QuizRepository.CreateQuestion(question)
	if err != nil {
		return nil, err
	}

	return question, nil
}
