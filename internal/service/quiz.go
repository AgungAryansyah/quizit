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
	GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *entity.Quiz, err error)
	CreateAttempt(answers dto.UserAnswersDto) (attempt *entity.Attempt, err error)
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

func (s *QuizService) GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *entity.Quiz, err error) {
	return s.QuizRepository.GetQuizWithQuestionAndOption(quizId)
}

func (s *QuizService) CreateAttempt(answers dto.UserAnswersDto) (attempt *entity.Attempt, err error) {
	var score int

	for questionId, answerId := range answers.Answers {
		correct, err := s.QuizRepository.IsCorrect(answerId)
		if err != nil {
			return nil, err
		}

		if correct {
			question, err := s.QuizRepository.GetQuestion(questionId)
			if err != nil {
				return nil, err
			}

			score += question.Score
		}
	}

	attempt = &entity.Attempt{
		Id:           uuid.New(),
		UserId:       answers.UserId,
		QuizId:       answers.QuizId,
		TotalScore:   score,
		FinishedTime: time.Now(),
	}

	err = s.QuizRepository.CreteAttempt(attempt)
	if err != nil {
		return nil, err
	}

	return attempt, nil
}
