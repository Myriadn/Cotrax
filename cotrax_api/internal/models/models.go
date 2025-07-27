package models

import "time"

type Projects struct {
	ID          int64  `json:"id"`
	ProjectName string `json:"project_name"`
	ProjectPath string `json:"project_path"`
	CreatedAt   time.Time `json:"created_at"`
}

type Files struct {
	ID        int64  `json:"id"`
	ProjectID int64  `json:"project_id"`
	FileName  string `json:"filename"`
	FilePath  string `json:"filepath"`
	CreatedAt time.Time `json:"created_at"`
}

type Time_Logs struct {
	ID              int64     `json:"id"`
	FileID          int64     `json:"file_id"`
	StartTime       time.Time `json:"start_time"`
	EndTime         time.Time `json:"end_time"`
	DurationSeconds int64     `json:"duration_seconds"`
	CreatedAt       time.Time `json:"created_at"`
}

type ResponseAPI struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}