package util

import (
	"crypto/rand"
	"encoding/base64"
)

func GenerateRandomString(length int) (string, error) {
	bytes := make([]byte, length*3/4)

	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	token := base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(bytes)

	if len(token) > length {
		token = token[:length]
	}
	return token, nil
}
