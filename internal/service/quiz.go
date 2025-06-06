package service

import (
	"quizit-be/internal/repository"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"quizit-be/pkg/util"

	"github.com/google/uuid"
)

type IQuizService interface {
	GetAllQuizzes(keyword string, page, pageSize int) (quiz *[]entity.Quiz, err error)
	GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *dto.QuizDto, err error)
	CreateQuiz(createQuiz *dto.CreateQuiz, userId uuid.UUID) (res *dto.CreateQuizRes, err error)
	GetQuizByCode(quizCode string) (quizId *uuid.UUID, err error)
	GetUserQuizzes(userId uuid.UUID, page, pageSize int) (quiz *[]entity.Quiz, err error)
	DeleteQuiz(quizId uuid.UUID, userId uuid.UUID) error
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

func (s *QuizService) GetAllQuizzes(keyword string, page, pageSize int) (quiz *[]entity.Quiz, err error) {
	return s.QuizRepository.GetQuizzes(keyword, page, pageSize)
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

func (s *QuizService) GetQuizByCode(quizCode string) (quizId *uuid.UUID, err error) {
	quiz, err := s.QuizRepository.GetQuizByCode(quizCode)
	if err != nil {
		return nil, err
	}

	return &quiz.Id, nil
}

func (s *QuizService) GetUserQuizzes(userId uuid.UUID, page, pageSize int) (quiz *[]entity.Quiz, err error) {
	return s.QuizRepository.GetUserQuizzes(userId, page, pageSize)
}

func (s *QuizService) DeleteQuiz(quizId uuid.UUID, userId uuid.UUID) error {
	return s.QuizRepository.DeleteQuiz(quizId, userId)
}
