package jwt

import (
	"errors"
	"quizit-be/pkg/env"
	"quizit-be/pkg/response"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

type IJWT interface {
	GenerateToken(id uuid.UUID, roleId int) (string, error)
	ValidateToken(token string) (uuid.UUID, int, error)
}

type JWT struct {
	secretKey string
	expiresAt time.Time
}

func NewJwt(env env.Env) IJWT {
	err := godotenv.Load()
	if err != nil {
		return nil
	}
	exp, err := strconv.Atoi(env.JWT_EXPIRED)
	if err != nil {
		return nil
	}
	secret := env.JWT_SECRET
	return &JWT{
		secretKey: secret,
		expiresAt: time.Now().Add(time.Duration(exp) * time.Hour),
	}
}

type Claims struct {
	Id   uuid.UUID
	Role int
	jwt.RegisteredClaims
}

func (j *JWT) GenerateToken(id uuid.UUID, roleId int) (string, error) {
	claim := Claims{
		Id:   id,
		Role: roleId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(j.expiresAt),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	tokenString, err := token.SignedString([]byte(j.secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func (j *JWT) ValidateToken(tokenString string) (uuid.UUID, int, error) {
	var claim Claims

	token, err := jwt.ParseWithClaims(tokenString, &claim, func(t *jwt.Token) (interface{}, error) {
		return []byte(j.secretKey), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return uuid.Nil, 0, &response.ExpiredToken
		}
		return uuid.Nil, 0, err
	}

	if !token.Valid {
		return uuid.Nil, 0, &response.InvalidToken
	}

	return claim.Id, claim.Role, nil
}
