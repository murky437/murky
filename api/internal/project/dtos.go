package project

import (
	"database/sql"
	"murky_api/internal/model"
	"murky_api/internal/validation"
	"strings"
)

type CreateProjectRequest struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}

func (request *CreateProjectRequest) Validate(db *sql.DB) *validation.Result {
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

	if isUnique, _ := model.IsProjectSlugUnique(db, request.Slug); !isUnique {
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

type CreateProjectResponse struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}

type ProjectListResponse struct {
	Data []ProjectListItem `json:"data"`
}

type ProjectListItem struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
}
