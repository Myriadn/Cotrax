package models

type Projects struct {
	ID          int64  `json:"id"`
	ProjectName string `json:"name"`
	ProjectPath string `json:"path"`
	CreatedAt   string `json:"created_at"`
}

type Files struct {
	ID         int64  `json:"id"`
	ProjectsID int64  `json:"projects_id"`
	FileName   string `json:"filename"`
	FilePath   string `json:"filepath"`
	CreatedAt  string `json:"created_at"`
}

type Time_Logs struct {
	ID              int64  `json:"id"`
	FilesID         int64  `json:"files_id"`
	StartTime       string `json:"start_time"`
	EndTime         string `json:"end_time"`
	DurationSeconds int64  `json:"duration_seconds"`
	CreatedAt       string `json:"created_at"`
}