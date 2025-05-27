package rest

import (
	"quizit-be/model/dto"
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

func (h *Handler) CreateArticle(ctx *fiber.Ctx) error {
	var create dto.CreateArticle
	if err := ctx.BodyParser(&create); err != nil {
		return &response.Unauthorized
	}

	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	articleId, err := h.service.ArticleServie.CreateArticle(&create, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", articleId)
}
