-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id UUID PRIMARY KEY,
    theme VARCHAR(50) NOT NULL,
    title VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY, 
    quiz_id UUID NOT NULL,
    score INTEGER NOT NULL CHECK (score > 0), 
    question_text TEXT NOT NULL,
    question_image TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_options (
    option_id UUID PRIMARY KEY,
    question_id UUID NOT NULL, 
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    option_text TEXT NOT NULL,
    option_image TEXT,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    attempt_id UUID PRIMARY KEY, 
    user_id UUID NOT NULL,
    quiz_id UUID NOT NULL,
    total_score INTEGER NOT NULL CHECK (total_score > 0),
    finished_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS quiz_attempts;
DROP TABLE IF EXISTS question_options;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizzes;
-- +goose StatementEnd
