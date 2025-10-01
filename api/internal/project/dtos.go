package project

import (
	"database/sql"
	"murky_api/internal/model"
	"murky_api/internal/validation"
	"strings"
)

type CreateRequest struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}

func (request *CreateRequest) Validate(db *sql.DB) *validation.Result {
	result := &validation.Result{
		GeneralErrors: []string{},
		FieldErrors:   make(map[string][]string),
	}

	if strings.TrimSpace(request.Title) == "" {
		result.FieldErrors["title"] = append(result.FieldErrors["title"], validation.NotBlankMessage)
	}

	if strings.TrimSpace(request.Slug) == "" {
		result.FieldErrors["slug"] = append(result.FieldErrors["slug"], validation.NotBlankMessage)
	}

	if isUnique, _ := model.IsProjectSlugUnique(db, request.Slug, model.SlugCheckOptions{}); !isUnique {
		result.FieldErrors["slug"] = append(
			result.FieldErrors["slug"],
			"A project with this slug already exists. Slug must be unique.",
		)
	}

	if len(result.GeneralErrors) > 0 || len(result.FieldErrors) > 0 {
		return result
	}

	return nil
}

type CreateResponse struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}

type ListResponse struct {
	Data []ListItem `json:"data"`
}

type ListItem struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}

type GetResponse struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}

type UpdateRequest struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}

func (request *UpdateRequest) Validate(db *sql.DB, currentSlug string) *validation.Result {
	result := &validation.Result{
		GeneralErrors: []string{},
		FieldErrors:   make(map[string][]string),
	}

	if strings.TrimSpace(request.Title) == "" {
		result.FieldErrors["title"] = append(result.FieldErrors["title"], validation.NotBlankMessage)
	}

	if strings.TrimSpace(request.Slug) == "" {
		result.FieldErrors["slug"] = append(result.FieldErrors["slug"], validation.NotBlankMessage)
	}

	if isUnique, _ := model.IsProjectSlugUnique(db, request.Slug, model.SlugCheckOptions{CurrentSlug: currentSlug}); !isUnique {
		result.FieldErrors["slug"] = append(
			result.FieldErrors["slug"],
			"A project with this slug already exists. Slug must be unique.",
		)
	}

	if len(result.GeneralErrors) > 0 || len(result.FieldErrors) > 0 {
		return result
	}

	return nil
}

type UpdateResponse struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}
