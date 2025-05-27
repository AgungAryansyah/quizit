package rest

import (
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func (h *Handler) GetArticle(ctx *fiber.Ctx) error {
	articleId, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return &response.BadRequest
	}

	article, err := h.service.ArticleServie.GetArticle(articleId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", article)
}

func (h *Handler) GetArticles(ctx *fiber.Ctx) error {
	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)

	articles, err := h.service.ArticleServie.GetArticles(page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", articles)
}
