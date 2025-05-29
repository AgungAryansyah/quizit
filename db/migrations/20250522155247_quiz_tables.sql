-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY,
    theme VARCHAR(50) NOT NULL,
    title VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY, 
    quiz_id UUID NOT NULL,
    score INTEGER NOT NULL CHECK (score > 0), 
    text TEXT NOT NULL,
    image TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS options (
    id UUID PRIMARY KEY,
    question_id UUID NOT NULL, 
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    text TEXT NOT NULL,
    image TEXT,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY, 
    user_id UUID NOT NULL,
    quiz_id UUID NOT NULL,
    total_score INTEGER NOT NULL CHECK (total_score >= 0),
    finished_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS attempts;
DROP TABLE IF EXISTS options;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizzes;
-- +goose StatementEnd
