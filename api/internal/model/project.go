package model

import "database/sql"

type Project struct {
	Id    int
	Title string
	Slug  string
}

func SaveProject(db *sql.DB, project Project, userId int) (Project, error) {
	res, err := db.Exec("INSERT INTO project (title, slug) VALUES (?, ?)", project.Title, project.Slug)
	if err != nil {
		return project, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return project, err
	}
	project.Id = int(id)

	// link user <-> project
	_, err = db.Exec("INSERT INTO user_project (user_id, project_id) VALUES (?, ?)", userId, project.Id)
	if err != nil {
		return project, err
	}
	return project, nil
}

func UpdateProject(db *sql.DB, currentSlug string, project Project) error {
	_, err := db.Exec("UPDATE project SET title = ?, slug = ? WHERE slug = ?", project.Title, project.Slug, currentSlug)
	return err
}

type SlugCheckOptions struct {
	CurrentSlug string
}

func IsProjectSlugUnique(db *sql.DB, slug string, opts SlugCheckOptions) (bool, error) {
	var (
		query string
		args  []any
	)

	if opts.CurrentSlug != "" {
		query = "SELECT COUNT(1) FROM project WHERE slug = ? AND slug != ?"
		args = []any{slug, opts.CurrentSlug}
	} else {
		query = "SELECT COUNT(1) FROM project WHERE slug = ?"
		args = []any{slug}
	}

	var count int
	err := db.QueryRow(query, args...).Scan(&count)
	if err != nil {
		return false, err
	}
	return count == 0, nil
}

func GetProjectsByUserId(db *sql.DB, userId int) ([]Project, error) {
	rows, err := db.Query(`
		SELECT p.id, p.title, p.slug
		FROM project p
		JOIN user_project up ON up.project_id = p.id
		JOIN user u ON u.id = up.user_id
		WHERE u.id = ?
	`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		if err := rows.Scan(&p.Id, &p.Title, &p.Slug); err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, rows.Err()
}

func GetProjectByUserIdAndSlug(db *sql.DB, userId int, slug string) (Project, error) {
	var p Project
	err := db.QueryRow(`
		SELECT p.id, p.title, p.slug
		FROM project p
		JOIN user_project up ON up.project_id = p.id
		WHERE up.user_id = ? AND p.slug = ?
	`, userId, slug).Scan(&p.Id, &p.Title, &p.Slug)

	return p, err
}
