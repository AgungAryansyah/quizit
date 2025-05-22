package entity

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	UserId    uuid.UUID `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
}
