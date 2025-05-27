package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"quizit-be/pkg/response"
	"time"

	"github.com/google/uuid"
)

type IAttemptService interface {
	CreateAttempt(answers dto.UserAnswersDto, userId uuid.UUID) (attempt *entity.Attempt, err error)
	GetUserAttempt(userId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error)
	GetQuizAttempt(quizId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error)
}

type AttemptService struct {
	AttemptRepository repository.IAttemptRepository
	QuizRepository    repository.IQuizRepository
}

func NewAttemptService(AttemptRepository repository.IAttemptRepository, QuizRepository repository.IQuizRepository) IAttemptService {
	return &AttemptService{
		AttemptRepository: AttemptRepository,
		QuizRepository:    QuizRepository,
	}
}

func (s *AttemptService) CreateAttempt(answers dto.UserAnswersDto, userId uuid.UUID) (attempt *entity.Attempt, err error) {
	var score int

	quiz, err := s.QuizRepository.GetQuizByCode(answers.QuizCode)
	if err != nil {
		return nil, err
	}

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

			if question.QuizId != quiz.Id {
				return nil, &response.BadRequest
			}

			score += question.Score
		}
	}

	attempt = &entity.Attempt{
		Id:           uuid.New(),
		UserId:       userId,
		QuizId:       quiz.Id,
		TotalScore:   score,
		FinishedTime: time.Now(),
	}

	err = s.AttemptRepository.CreteAttempt(attempt)
	if err != nil {
		return nil, err
	}

	return attempt, nil
}

func (s *AttemptService) GetUserAttempt(userId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error) {
	return s.AttemptRepository.GetUserAttempt(userId, page, pageSize)
}

func (s *AttemptService) GetQuizAttempt(quizId uuid.UUID, page, pageSize int) (attempts *[]entity.Attempt, err error) {
	return s.AttemptRepository.GetQuizAttempt(quizId, page, pageSize)
}
