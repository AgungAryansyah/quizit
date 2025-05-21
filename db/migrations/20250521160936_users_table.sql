-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS roles(
    id SMALLINT PRIMARY KEY,
    role VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO roles (id, role) VALUES
    (1, 'admin'),
    (2, 'user');

CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_picture TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id SMALLINT NOT NULL DEFAULT 2,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    user_id UUID NOT NULL,
    token varchar(255) UNIQUE,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sessions;
-- +goose StatementEnd
