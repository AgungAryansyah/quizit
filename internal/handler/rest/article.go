package rest

import (
	"quizit-be/model/dto"
	"quizit-be/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// @summary Get an article by id
// @tags Article
// @produce json
// @param id path string true "Article id"
// @router /articles/{id} [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 404 {object} dto.HttpError "Article not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) GetArticle(ctx *fiber.Ctx) error {
	articleId, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return &response.BadRequest
	}

	article, err := h.service.ArticleService.GetArticle(articleId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", article)
}

// @summary Create an article
// @tags Article
// @accept json
// @produce json
// @param createArticle body dto.CreateArticleReq true "Crete article"
// @router /articles [post]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Unaouthorized"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) CreateArticle(ctx *fiber.Ctx) error {
	var create dto.CreateArticleReq
	if err := ctx.BodyParser(&create); err != nil {
		return &response.Unauthorized
	}

	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	if err := h.validator.Struct(create); err != nil {
		return err
	}

	articleId, err := h.service.ArticleService.CreateArticle(&create, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", articleId)
}

// @summary Get an article by search param
// @tags Article
// @produce json
// @param page 	  query int true     "Page number"
// @param size 	  query int true     "Page size"
// @param keyword query string false "Search Keyword"
// @router /articles [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 404 {object} dto.HttpError "Article not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) SearchArticles(ctx *fiber.Ctx) error {
	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)
	keyword := ctx.Query("keyword", "")

	articles, err := h.service.ArticleService.SearchArticles(keyword, page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", articles)
}

// @summary Get an article written by the user
// @tags Article
// @produce json
// @router /articles/users [get]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Unaouthorized"
// @failure 404 {object} dto.HttpError "Article not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) GetUserArticles(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	page := ctx.QueryInt("page", 1)
	pageSize := ctx.QueryInt("size", 9)

	articles, err := h.service.ArticleService.GetUserArticles(userId, page, pageSize)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", articles)
}

// @summary Delete an article by id
// @tags Article
// @produce json
// @param id path string true "Article id"
// @router /articles/{id} [delete]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Unaouthorized"
// @failure 404 {object} dto.HttpError "Article not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) DeleteArticle(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	articleId, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return &response.BadRequest
	}

	err = h.service.ArticleService.DeleteArticle(articleId, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", nil)
}

// @summary Edit an article
// @tags Article
// @produce json
// @param editArtilce body dto.EditArticleReq true "Edit article request body"
// @router /articles [patch]
// @success 200 {object} dto.HttpSuccess
// @failure 400 {object} dto.HttpError "Validation error"
// @failure 401 {object} dto.HttpError "Unaouthorized"
// @failure 404 {object} dto.HttpError "Article not found"
// @failure 500 {object} dto.HttpError "Internal Server error"
func (h *Handler) EditArticle(ctx *fiber.Ctx) error {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return &response.Unauthorized
	}

	var edit dto.EditArticleReq
	if err := ctx.BodyParser(&edit); err != nil {
		return &response.Unauthorized
	}

	if err := h.validator.Struct(edit); err != nil {
		return err
	}

	err := h.service.ArticleService.EditArticle(&edit, userId)
	if err != nil {
		return err
	}

	return response.HttpSuccess(ctx, "success", nil)
}
