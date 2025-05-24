package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"time"

	"github.com/google/uuid"
)

type IAttemptService interface {
	CreateAttempt(answers dto.UserAnswersDto) (attempt *entity.Attempt, err error)
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

func (s *AttemptService) CreateAttempt(answers dto.UserAnswersDto) (attempt *entity.Attempt, err error) {
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

	err = s.AttemptRepository.CreteAttempt(attempt)
	if err != nil {
		return nil, err
	}

	return attempt, nil
}
