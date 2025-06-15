package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// @summary Create a new account
// @description  Create a new user with the input payload
// @tags Auth
// @accept json
// @produce json
// @param registerReq body dto.RegisterReq true "Register request body"
// @router /auths/register [post]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 409 {object} dto.HttpError "User already exist"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) Register(ctx *fiber.Ctx) error {
	var register dto.RegisterReq
	if err := ctx.BodyParser(&register); err != nil {
		return err
	}

	if err := h.validator.Struct(register); err != nil {
		return err
	}

	if err := h.service.AuthService.Register(&register); err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", nil)
}

// @summary Logs into an account
// @tags Auth
// @accept json
// @produce json
// @param loginReq body dto.LoginReq true "Login request body"
// @router /auths/login [post]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) Login(ctx *fiber.Ctx) error {
	var login dto.LoginReq
	if err := ctx.BodyParser(&login); err != nil {
		return err
	}

	if err := h.validator.Struct(login); err != nil {
		return err
	}

	expiry, err := strconv.Atoi(h.env.JWT_EXPIRED)
	if err != nil {
		return err
	}

	res, err := h.service.AuthService.Login(&login, expiry)
	if err != nil {
		return err
	}

	ctx.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    res.Token,
		Expires:  time.Now().Add(time.Duration(expiry) * time.Second),
		HTTPOnly: true,
		Secure:   false,
		Path:     "/",
		SameSite: "None",
	})

	ctx.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    res.RefreshToken,
		Expires:  time.Now().Add(time.Duration(expiry) * time.Second),
		HTTPOnly: true,
		Secure:   false,
		Path:     "/",
		SameSite: "None",
	})

	return response.HttpSuccess(ctx, "success", nil)
}

// @summary Refresh user session
// @tags Auth
// @produce json
// @router /auths/refresh [post]
// @success 200 {object} dto.HttpSuccess
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) RefreshToken(ctx *fiber.Ctx) error {
	expiry, err := strconv.Atoi(h.env.JWT_EXPIRED)
	if err != nil {
		return err
	}

	res, err := h.service.AuthService.ReplaceToken(ctx.Cookies("refresh_token"), expiry)
	if err != nil {
		return err
	}

	ctx.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    res.Token,
		Expires:  time.Now().Add(time.Duration(expiry) * time.Second),
		HTTPOnly: true,
		Secure:   false,
		Path:     "/",
		SameSite: "None",
	})

	ctx.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    res.RefreshToken,
		Expires:  time.Now().Add(time.Duration(expiry) * time.Second),
		HTTPOnly: true,
		Secure:   false,
		Path:     "/",
		SameSite: "None",
	})

	return response.HttpSuccess(ctx, "success", nil)
}

// @summary Logs user out by deleting the session and cookie
// @tags Auth
// @produce json
// @router /auths/logout [post]
// @success 200 {object} dto.HttpSuccess
// @failure 401 {object} dto.HttpError "Invalid credentials"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) Logout(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	if err := h.service.AuthService.Logout(userId); err != nil {
		return err
	}

	ctx.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		Secure:   false,
		Path:     "/",
	})

	ctx.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		Secure:   false,
		Path:     "/",
	})

	return response.HttpSuccess(ctx, "success", nil)
}
