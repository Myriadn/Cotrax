package services

import (
	"context"
	"database/sql"

	"github.com/Myriadn/Cotrax/internal/models"
)

type Services struct {
	DB *sql.DB
}

// this is a service layer that interacts with the database
// like doing CRUD operations
func (s *Services) CreateProject(ctx context.Context, project *models.Projects) (*models.Projects, error) {
	query := `
		INSERT INTO projects (project_name, project_path)
		VALUES ($1, $2)
		RETURNING id, project_name, project_path, created_at;`
	row := s.DB.QueryRowContext(ctx, query, project.ProjectName, project.ProjectPath)
	err := row.Scan(&project.ID,
		&project.ProjectName,
		&project.ProjectPath,
		&project.CreatedAt)
	return project, err
}

func (s *Services) GetAllProjects(ctx context.Context) ([]models.Projects, error) {
	query := `SELECT id, project_name, project_path, created_at FROM projects ORDER BY created_at DESC;`
	rows, err := s.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []models.Projects

	for rows.Next() {
		var p models.Projects // just spelling p for project

		if err := rows.Scan(&p.ID, &p.ProjectName, &p.ProjectPath, &p.CreatedAt); err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}

	return projects, nil
}

func (s *Services) CreateFile(ctx context.Context, file *models.Files) (*models.Files, error) {
	query := `
		INSERT INTO files (file_name, file_path, project_id)
		VALUES ($1, $2, $3)
		RETURNING id, project_id, file_name, file_path, created_at;`
	row := s.DB.QueryRowContext(ctx, query, file.FileName, file.FilePath, file.ProjectID)
	err := row.Scan(&file.ID,
		&file.ProjectID,
		&file.FileName,
		&file.FilePath,
		&file.CreatedAt)
	return file, err
}

func (s *Services) GetAllFiles(ctx context.Context) ([]models.Files, error) {
	query := `SELECT id, file_name, file_path, project_id, created_at FROM files ORDER BY created_at DESC;`
	rows, err := s.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []models.Files

	for rows.Next() {
		var f models.Files // just spelling f for file

		if err := rows.Scan(&f.ID, &f.FileName, &f.FilePath, &f.ProjectID, &f.CreatedAt); err != nil {
			return nil, err
		}
		files = append(files, f)
	}

	return files, nil
}

func (s *Services) CreateTime_Logs(ctx context.Context, timeLog *models.Time_Logs) (*models.Time_Logs, error) {
	duration := timeLog.EndTime.Sub(timeLog.StartTime).Seconds()
	timeLog.DurationSeconds = int64(duration)
	
	query := `
		INSERT INTO time_logs (file_id, start_time, end_time, duration_seconds)
		VALUES ($1, $2, $3, $4)
		RETURNING id, file_id, start_time, end_time, duration_seconds, created_at;`

	row := s.DB.QueryRowContext(ctx, query, timeLog.FileID, timeLog.StartTime, timeLog.EndTime, timeLog.DurationSeconds)
	err := row.Scan(&timeLog.ID,
        &timeLog.FileID,
        &timeLog.StartTime,
        &timeLog.EndTime,
        &timeLog.DurationSeconds,
        &timeLog.CreatedAt)
	return timeLog, err
}

func (s *Services) GetAllTime_Logs(ctx context.Context) ([]models.Time_Logs, error) {
	query := `SELECT id, file_id, start_time, end_time, duration_seconds, created_at FROM time_logs ORDER BY created_at DESC;`
	rows, err := s.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var timeLogs []models.Time_Logs

	for rows.Next() {
		var tl models.Time_Logs // yeah just spelling tl for time log

		if err := rows.Scan(&tl.ID, &tl.FileID, &tl.StartTime, &tl.EndTime, &tl.DurationSeconds, &tl.CreatedAt); err != nil {
			return nil, err
		}
		timeLogs = append(timeLogs, tl)
	}

	return timeLogs, nil
}