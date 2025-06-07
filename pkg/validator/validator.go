package validator

import (
	"unicode"

	"github.com/go-playground/validator/v10"
)

func NewValidator() *validator.Validate {
	val := validator.New(validator.WithRequiredStructEnabled())
	RegisterValidator(*val)

	return val
}

func RegisterValidator(val validator.Validate) {
	val.RegisterValidation("password", Password)
}

func Password(fl validator.FieldLevel) bool {
	password := fl.Field().String()

	if len(password) < 8 {
		return false
	}

	var (
		hasUpper   bool
		hasLower   bool
		hasDigit   bool
		hasSpecial bool
	)

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsDigit(char):
			hasDigit = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	return hasUpper && hasLower && hasDigit && hasSpecial
}
