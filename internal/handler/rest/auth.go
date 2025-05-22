package rest

import (
	"quizit-be/model/dto"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) Register(ctx *fiber.Ctx) error {
	var register dto.Register
	if err := ctx.BodyParser(&register); err != nil {
		return err
	}

	if err := h.service.AuthService.Register(&register); err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{
		"message": "success",
		"payload": nil,
	})
}

func (h *Handler) Login(ctx *fiber.Ctx) error {
	var login dto.LoginReq
	if err := ctx.BodyParser(&login); err != nil {
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

	return ctx.JSON(fiber.Map{
		"message": "success",
		"payload": nil,
	})
}

//todo: add error handler and validator
