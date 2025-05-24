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
	GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *entity.Quiz, err error)
	GetQuiz(quizParam dto.QuizParam) (quiz *entity.Quiz, err error)
	IsCorrect(OptionId uuid.UUID) (correct bool, err error)
	GetQuestion(questionId uuid.UUID) (question *entity.Question, err error)
	GetBestAttempt(userId uuid.UUID, quizId uuid.UUID) (attempt *entity.Attempt, err error)
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

func (r *QuizRepository) GetQuizWithQuestionAndOption(quizId uuid.UUID) (quiz *entity.Quiz, err error) {
	quiz = &entity.Quiz{}
	query := `SELECT id, theme, title FROM quizzes WHERE id = $1`
	err = r.db.Get(quiz, query, quizId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &response.QuizNotFound
		}
		return nil, err
	}

	var questions []entity.Question
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

	var options []entity.Option
	query = `
        SELECT id, question_id, is_correct, text, image
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

	optionsByQuestion := make(map[uuid.UUID][]entity.Option)
	for _, opt := range options {
		optionsByQuestion[opt.QuestionId] = append(optionsByQuestion[opt.QuestionId], opt)
	}

	for i, q := range questions {
		questions[i].Options = optionsByQuestion[q.Id]
	}

	quiz.Questions = questions

	return quiz, nil
}

func (r *QuizRepository) GetQuiz(quizParam dto.QuizParam) (quiz *entity.Quiz, err error) {
	quiz = &entity.Quiz{}
	query := `SELECT id, theme, title FROM quizzes WHERE id = $1`
	err = r.db.Get(quiz, query, quizParam.QuizId)
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

func (r *QuizRepository) GetBestAttempt(userId uuid.UUID, quizId uuid.UUID) (attempt *entity.Attempt, err error) {
	attempt = &entity.Attempt{}
	query := `SELECT * FROM attempts WHERE user_id = $1 AND quiz_id = $2 ORDER BY total_score DESC LIMIT 1`
	err = r.db.Get(attempt, query, userId, quizId)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, &response.AttemptNotFound
	}

	return attempt, err
}
