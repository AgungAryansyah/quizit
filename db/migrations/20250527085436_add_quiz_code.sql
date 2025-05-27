-- +goose Up
-- +goose StatementBegin
ALTER TABLE quizzes ADD COLUMN quiz_code VARCHAR(6);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE quizzes DROP COLUMN user_id;
-- +goose StatementEnd
