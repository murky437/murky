package project

import (
	"database/sql"
	"murky_api/internal/app"
	"murky_api/internal/jwt"
	"murky_api/internal/model"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestDeleteProjectUnauthorized(t *testing.T) {
	req := httptest.NewRequest(http.MethodDelete, "/projects/project-1", nil)
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusUnauthorized, rr.Code)
}

func TestDeleteProjectSuccess(t *testing.T) {
	token, err := jwt.CreateAccessToken(model.User{Id: 1, Username: "user"}, time.Now().Add(time.Hour))
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodDelete, "/projects/project-1", nil)
	req.Header.Add("Authorization", "Bearer "+token)
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusNoContent, rr.Code)

	_, err = model.GetProjectByUserIdAndSlug(c.Db, 1, "project-1")
	require.ErrorIs(t, err, sql.ErrNoRows)
}

func TestDeleteOtherUserProjectNotFound(t *testing.T) {
	token, err := jwt.CreateAccessToken(model.User{Id: 1, Username: "user"}, time.Now().Add(time.Hour))
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodDelete, "/projects/project-4", nil)
	req.Header.Add("Authorization", "Bearer "+token)
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusNotFound, rr.Code)
}
