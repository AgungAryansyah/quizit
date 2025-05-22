package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"time"

	"github.com/google/uuid"
)

type IQuizService interface {
	GetAllQuizzes(page, pageSize int) (quiz *[]entity.Quiz, err error)
	GetQuizWithQuestionAndOption(quizParam dto.QuizParam) (quiz *entity.Quiz, err error)
	CreateAttempt(answers dto.UserAnswersDto) error
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

func (s *QuizService) GetQuizWithQuestionAndOption(quizParam dto.QuizParam) (quiz *entity.Quiz, err error) {
	return s.QuizRepository.GetQuizWithQuestionAndOption(quizParam.QuizId)
}

func (s *QuizService) CreateAttempt(answers dto.UserAnswersDto) error {
	var score int

	for questionId, answerId := range answers.Answers {
		correct, err := s.QuizRepository.IsCorrect(answerId)
		if err != nil {
			return err
		}

		if correct {
			question, err := s.QuizRepository.GetQuestion(questionId)
			if err != nil {
				return err
			}

			score += question.Score
		}
	}

	attempt := &entity.Attempt{
		Id:           uuid.New(),
		UserId:       answers.UserId,
		QuizId:       answers.QuizId,
		TotalScore:   score,
		FinishedTime: time.Now(),
	}

	return s.QuizRepository.CreteAttempt(attempt)
}
