-- +goose Up
-- +goose StatementBegin
ALTER TABLE quizzes ADD COLUMN user_id UUID;
ALTER TABLE quizzes ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE quizzes DROP COLUMN user_id UUID;
-- +goose StatementEnd
