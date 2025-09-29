package auth

import (
	"bytes"
	"encoding/json"
	"murky_api/internal/app"
	"murky_api/internal/auth"
	"murky_api/internal/routing"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestCreateTokensInvalidContentType(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/auth/create-tokens", nil)
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusUnsupportedMediaType, rr.Code)
}

func TestCreateTokensInvalidJson(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/auth/create-tokens", strings.NewReader("{]"))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestCreateTokensValidationError(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/auth/create-tokens", strings.NewReader("{}"))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusUnprocessableEntity, rr.Code)

	var resp routing.ValidationErrorResponse
	err := json.Unmarshal(rr.Body.Bytes(), &resp)
	require.NoError(t, err)

	require.Equal(t, []string{"Must not be blank."}, resp.FieldErrors["username"])
	require.Equal(t, []string{"Must not be blank."}, resp.FieldErrors["password"])
}

func TestCreateTokensUserNotFound(t *testing.T) {
	body := auth.CreateTokensRequest{Username: "invaliduser", Password: "pass"}
	bodyJson, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/auth/create-tokens", bytes.NewReader(bodyJson))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusUnprocessableEntity, rr.Code)

	var resp routing.ValidationErrorResponse
	err = json.Unmarshal(rr.Body.Bytes(), &resp)
	require.NoError(t, err)

	require.Equal(t, []string{"Invalid credentials"}, resp.GeneralErrors)
}

func TestCreateTokensInvalidPassword(t *testing.T) {

	body := auth.CreateTokensRequest{Username: "user", Password: "pass1"}
	bodyJson, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/auth/create-tokens", bytes.NewReader(bodyJson))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer c.Close()
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusUnprocessableEntity, rr.Code)

	var resp routing.ValidationErrorResponse
	err = json.Unmarshal(rr.Body.Bytes(), &resp)
	require.NoError(t, err)

	require.Equal(t, []string{"Invalid credentials"}, resp.GeneralErrors)
}

func TestCreateTokensSuccess(t *testing.T) {
	body := auth.CreateTokensRequest{Username: "user", Password: "pass"}
	bodyJson, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/auth/create-tokens", bytes.NewReader(bodyJson))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	c := app.NewTestContainer(t)
	defer func(c *app.Container) {
		err := c.Close()
		if err != nil {
			t.Fatal(err)
		}
	}(c)
	app.NewMux(c).ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp auth.CreateTokensResponse
	err = json.Unmarshal(rr.Body.Bytes(), &resp)
	require.NoError(t, err)

	require.NotEmpty(t, resp.AccessToken)
	require.NotEmpty(t, resp.RefreshToken)
}
