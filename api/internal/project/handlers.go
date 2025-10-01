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

		var req CreateRequest
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

		resp := CreateResponse{
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

		resp := ListResponse{
			Data: make([]ListItem, 0),
		}
		for _, project := range projects {
			resp.Data = append(resp.Data, ListItem{
				Title: project.Title,
				Slug:  project.Slug,
			})
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}

func GetProject(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := context.GetCurrentUser(r)

		project, err := model.GetProjectByUserIdAndSlug(db, user.Id, r.PathValue("slug"))
		if err != nil {
			routing.WriteNotFoundResponse(w)
			return
		}

		resp := GetResponse{
			Title: project.Title,
			Slug:  project.Slug,
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}

func UpdateProject(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := context.GetCurrentUser(r)
		currentSlug := r.PathValue("slug")

		project, err := model.GetProjectByUserIdAndSlug(db, user.Id, currentSlug)
		if err != nil {
			routing.WriteNotFoundResponse(w)
			return
		}

		var req UpdateRequest
		err = json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			routing.WriteInvalidJsonResponse(w)
			return
		}

		validationResult := req.Validate(db, currentSlug)
		if validationResult != nil {
			routing.WriteValidationErrorResponse(w, *validationResult)
			return
		}

		project.Title = req.Title
		project.Slug = req.Slug

		err = model.UpdateProject(db, currentSlug, project)
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		resp := UpdateResponse{
			Title: project.Title,
			Slug:  project.Slug,
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}
