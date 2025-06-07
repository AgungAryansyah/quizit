package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (h *Handler) Register(ctx *fiber.Ctx) error {
	var register dto.Register
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

//todo: add global handler and validator
