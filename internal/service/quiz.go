package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"quizit-be/pkg/util"

	"github.com/google/uuid"
)

type IQuizService interface {
	GetAllQuizzes(page, pageSize int) (quiz *[]entity.Quiz, err error)
	GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *dto.QuizDto, err error)
	CreateQuiz(createQuiz *dto.CreateQuiz, userId uuid.UUID) (res *dto.CreateQuizRes, err error)
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

func (s *QuizService) CreateQuiz(createQuiz *dto.CreateQuiz, userId uuid.UUID) (res *dto.CreateQuizRes, err error) {
	quizId := uuid.New()
	quizCode, err := util.GenerateRandomString(6)
	if err != nil {
		return nil, err
	}

	quiz := &entity.Quiz{
		Id:       quizId,
		Theme:    createQuiz.Theme,
		Title:    createQuiz.Title,
		UserId:   userId,
		QuizCode: quizCode,
	}

	err = s.QuizRepository.CreateQuiz(quiz)
	if err != nil {
		return nil, err
	}

	for _, createQuestion := range createQuiz.Questions {
		questionId := uuid.New()

		question := &entity.Question{
			Id:     questionId,
			QuizId: quizId,
			Score:  createQuestion.Score,
			Text:   createQuestion.Text,
			Image:  "",
		}

		err = s.QuizRepository.CreateQuestion(question)
		if err != nil {
			return nil, err
		}

		for _, createOption := range createQuestion.Options {
			optionId := uuid.New()

			option := &entity.Option{
				Id:         optionId,
				QuestionId: questionId,
				IsCorrect:  createOption.IsCorrect,
				Text:       createOption.Text,
				Image:      "",
			}

			err = s.QuizRepository.CreateOption(option)
			if err != nil {
				return nil, err
			}
		}

	}

	return &dto.CreateQuizRes{
		Id:       quizId,
		QuizCode: quizCode,
	}, nil
}
