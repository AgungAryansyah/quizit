-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY, 
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS articles;
-- +goose StatementEnd
