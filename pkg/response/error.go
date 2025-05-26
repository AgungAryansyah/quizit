package response

import (
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type ErrorResponse struct {
	Err  error `json:"error"`
	Code int   `json:"code"`
}

func CustomErrorHandler(ctx *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"

	var fiberError *fiber.Error
	if errors.As(err, &fiberError) {
		code = fiberError.Code
		message = fiberError.Message
	}

	var errorRequest *ErrorResponse
	if errors.As(err, &errorRequest) {
		code = errorRequest.Code
		message = errorRequest.Error()
	}

	HttpError(ctx, code, message, err)

	return nil
}

func CustomErrorResponse(code int, message string) ErrorResponse {
	return ErrorResponse{
		Code: code,
		Err:  errors.New(message),
	}
}

func (e *ErrorResponse) Error() string {
	return e.Err.Error()
}

var (
	InternalServerError = CustomErrorResponse(http.StatusInternalServerError, "Internal server error")

	Unauthorized     = CustomErrorResponse(http.StatusUnauthorized, "Unauthorized access")
	Forbidden        = CustomErrorResponse(http.StatusForbidden, "Forbidden access")
	DuplicateAccount = CustomErrorResponse(http.StatusConflict, "User already exists")

	BadRequest = CustomErrorResponse(http.StatusBadRequest, "Bad request")

	UserNotFound     = CustomErrorResponse(http.StatusNotFound, "User not found")
	QuizNotFound     = CustomErrorResponse(http.StatusNotFound, "Quiz not found")
	QuestionNotFound = CustomErrorResponse(http.StatusNotFound, "Question not found")
	OptionNotFound   = CustomErrorResponse(http.StatusNotFound, "Option not found")
	AttemptNotFound  = CustomErrorResponse(http.StatusNotFound, "Attempt not found")
	ArticleNotFound  = CustomErrorResponse(http.StatusNotFound, "Article not found")

	InvalidToken       = CustomErrorResponse(http.StatusUnauthorized, "Token invalid")
	ExpiredToken       = CustomErrorResponse(http.StatusUnauthorized, "Expired token")
	InvalidCredentials = CustomErrorResponse(http.StatusUnauthorized, "Invalid credentials")
)
