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

func Create(db *sql.DB) http.HandlerFunc {
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

		project := model.ProjectBasic{
			Title: req.Title,
			Slug:  req.Slug,
		}

		project, err = model.CreateProject(db, project, user.Id)
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

func GetList(db *sql.DB) http.HandlerFunc {
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

func Get(db *sql.DB) http.HandlerFunc {
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

func GetNotes(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := context.GetCurrentUser(r)

		project, err := model.GetProjectNotesByUserIdAndSlug(db, user.Id, r.PathValue("slug"))
		if err != nil {
			routing.WriteNotFoundResponse(w)
			return
		}

		resp := GetNotesResponse{
			Notes: project.Notes,
		}

		routing.WriteJsonResponse(w, http.StatusOK, resp)
	}
}

func Update(db *sql.DB) http.HandlerFunc {
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

		routing.WriteJsonResponse(w, http.StatusNoContent, nil)
	}
}

func Delete(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := context.GetCurrentUser(r)

		rowsDeleted, err := model.DeleteProjectByUserIdAndSlug(db, user.Id, r.PathValue("slug"))
		if err != nil || rowsDeleted == 0 {
			routing.WriteNotFoundResponse(w)
			return
		}

		routing.WriteJsonResponse(w, http.StatusNoContent, nil)
	}
}

func UpdateNotes(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := context.GetCurrentUser(r)
		currentSlug := r.PathValue("slug")

		projectNotes, err := model.GetProjectNotesByUserIdAndSlug(db, user.Id, currentSlug)
		if err != nil {
			routing.WriteNotFoundResponse(w)
			return
		}

		var req UpdateNotesRequest
		err = json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			routing.WriteInvalidJsonResponse(w)
			return
		}

		projectNotes.Notes = req.Notes

		err = model.UpdateProjectNotes(db, currentSlug, projectNotes)
		if err != nil {
			log.Println(err)
			routing.WriteInternalServerErrorResponse(w)
			return
		}

		routing.WriteJsonResponse(w, http.StatusNoContent, nil)
	}
}
