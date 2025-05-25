package repository

import (
	"database/sql"
	"errors"
	"quizit-be/model/dto"
	"quizit-be/model/entity"
	"quizit-be/pkg/response"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type IQuizRepository interface {
	GetAllQuizzes(page, pageSize int) (quiz *[]entity.Quiz, err error)
	GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *dto.QuizDto, err error)
	GetQuiz(quizId uuid.UUID) (quiz *entity.Quiz, err error)
	IsCorrect(OptionId uuid.UUID) (correct bool, err error)
	GetQuestion(questionId uuid.UUID) (question *entity.Question, err error)
	CreateQuiz(quiz *entity.Quiz) error
	CreateQuestion(question *entity.Question) error
	CreateOption(option *entity.Option) error
}

type QuizRepository struct {
	db *sqlx.DB
}

func NewQuizRepository(db *sqlx.DB) IQuizRepository {
	return &QuizRepository{
		db: db,
	}
}

func (r *QuizRepository) GetAllQuizzes(page, pageSize int) (quiz *[]entity.Quiz, err error) {
	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	quizzes := &[]entity.Quiz{}
	query := `SELECT * FROM quizzes LIMIT $1 OFFSET $2`
	err = r.db.Select(quizzes, query, pageSize, offset)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.QuizNotFound
	}
	return quizzes, err
}

func (r *QuizRepository) GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *dto.QuizDto, err error) {
	quiz = &dto.QuizDto{}
	query := `SELECT id, theme, title, user_id FROM quizzes WHERE id = $1`
	err = r.db.Get(quiz, query, quizId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.QuizNotFound
		}
		return nil, err
	}

	var questions []dto.QuestionDto
	query = `
        SELECT id, quiz_id, score, text, image
        FROM questions WHERE quiz_id = $1
    `
	err = r.db.Select(&questions, query, quizId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.QuestionNotFound
		}
		return nil, err
	}

	var options []dto.OptionDto
	query = `
        SELECT id, question_id, text, image
        FROM options WHERE question_id IN (
            SELECT id FROM questions WHERE quiz_id = $1
        )
    `
	err = r.db.Select(&options, query, quizId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.OptionNotFound
		}
		return nil, err
	}

	optionsByQuestion := make(map[uuid.UUID][]dto.OptionDto)
	for _, opt := range options {
		optionsByQuestion[opt.QuestionId] = append(optionsByQuestion[opt.QuestionId], opt)
	}

	for i, q := range questions {
		questions[i].Options = optionsByQuestion[q.Id]
	}

	quiz.Questions = questions

	return quiz, nil
}

func (r *QuizRepository) GetQuiz(quizId uuid.UUID) (quiz *entity.Quiz, err error) {
	quiz = &entity.Quiz{}
	query := `SELECT * FROM quizzes WHERE id = $1`
	err = r.db.Get(quiz, query, quizId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.QuizNotFound
		}
		return nil, err
	}

	return quiz, nil
}

func (r *QuizRepository) IsCorrect(OptionId uuid.UUID) (correct bool, err error) {
	option := &entity.Option{}
	query := `SELECT * FROM options WHERE id = $1`
	err = r.db.Get(option, query, OptionId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false, &response.OptionNotFound
		}
		return false, err
	}

	return option.IsCorrect, nil

}

func (r *QuizRepository) GetQuestion(questionId uuid.UUID) (question *entity.Question, err error) {
	question = &entity.Question{}
	query := `SELECT * FROM questions WHERE id = $1`
	err = r.db.Get(question, query, questionId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.QuestionNotFound
		}
		return nil, err
	}
	return question, nil
}

func (r *QuizRepository) CreateQuiz(quiz *entity.Quiz) error {
	query := `
		INSERT INTO quizzes (id, theme, title, user_id)
		VALUES ($1, $2, $3, $4)	
	`
	_, err := r.db.Exec(query, quiz.Id, quiz.Theme, quiz.Title, quiz.UserId)
	return err
}

func (r *QuizRepository) CreateQuestion(question *entity.Question) error {
	query := `
		INSERT INTO questions (id, quiz_id, score, text, image)
		VALUES ($1, $2, $3, $4, $5)	
	`
	_, err := r.db.Exec(query, question.Id, question.QuizId, question.Score, question.Text, question.Image)
	return err
}

func (r *QuizRepository) CreateOption(option *entity.Option) error {
	query := `
		INSERT INTO options (id, question_id, is_correct, text, image)
		VALUES ($1, $2, $3, $4, $5)	
	`
	_, err := r.db.Exec(query, option.Id, option.QuestionId, option.IsCorrect, option.Text, option.Image)
	return err
}
