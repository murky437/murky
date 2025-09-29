package project

import (
	"database/sql"
	"encoding/json"
	"log"
	"murky_api/internal/context"
	"murky_api/internal/model"
	"murky_api/internal/routing"
	"net/http"
)

func CreateProject(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := context.GetCurrentUser(r)

		var req CreateProjectRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			routing.WriteInvalidJsonResponse(w)
			return
		}

		validationResult := req.Validate(db)
		if validationResult != nil {
			routing.WriteValidationErrorResponse(w, *validationResult)
			return
		}

		project := model.Project{
			Title: req.Title,
			Slug:  req.Slug,
		}

		project, err = model.SaveProject(db, project, user.Id)
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		resp := CreateProjectResponse{
			Title: project.Title,
			Slug:  project.Slug,
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}

func GetProjectList(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := context.GetCurrentUser(r)

		projects, err := model.GetProjectsByUserId(db, user.Id)
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		resp := ProjectListResponse{
			Data: make([]ProjectListItem, 0),
		}
		for _, project := range projects {
			resp.Data = append(resp.Data, ProjectListItem{
				Title: project.Title,
				Slug:  project.Slug,
			})
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}
