package api

import (
	"encoding/json"
	"net/http"

	"github.com/Myriadn/Cotrax/internal/models"
	"github.com/Myriadn/Cotrax/internal/services"
)

type APIServer struct {
	Service *services.Services
}

func (s *APIServer) CreateProjectHandler(w http.ResponseWriter, r *http.Request) {
	var p models.Projects // p for project
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "it's not like that", http.StatusBadRequest)
		return
	}

	createdProject, err := s.Service.CreateProject(r.Context(), &p)
	if err != nil {
		http.Error(w, "Can't create project, because" + err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	
	response := models.ResponseAPI{
		Status:  "Nice",
		Message: "Project created successfully",
		Data:    createdProject,
	}
	
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (s *APIServer) GetAllProjectsHandler(w http.ResponseWriter, r *http.Request) {
	p, err := s.Service.GetAllProjects(r.Context())
	if err != nil {
		http.Error(w, "Could not retrieve projects: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	
	response := models.ResponseAPI{
		Status:  "Nice!",
		Message: "Projects retrieved successfully",
		Data:    p,
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (s *APIServer) CreateFileHandler(w http.ResponseWriter, r *http.Request) {
	var f models.Files // f spell for file
	if err := json.NewDecoder(r.Body).Decode(&f); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	createdFile, err := s.Service.CreateFile(r.Context(), &f)
	if err != nil {
		http.Error(w, "Could not create file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	
	response := models.ResponseAPI{
		Status:  "success",
		Message: "File created successfully",
		Data:    createdFile,
	}
	
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (s *APIServer) GetAllFilesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := s.Service.GetAllFiles(r.Context())
	if err != nil {
		http.Error(w, "Could not retrieve files: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	
	response := models.ResponseAPI{
		Status:  "success",
		Message: "Files retrieved successfully",
		Data:    files,
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (s *APIServer) CreateTimeLogHandler(w http.ResponseWriter, r *http.Request) {
	var tl models.Time_Logs // tl mean time log
	if err := json.NewDecoder(r.Body).Decode(&tl); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	createdLog, err := s.Service.CreateTime_Logs(r.Context(), &tl)
	if err != nil {
		http.Error(w, "Could not create time log: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	
	response := models.ResponseAPI{
		Status:  "success",
		Message: "Time log created successfully",
		Data:    createdLog,
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (s *APIServer) GetAllTimeLogsHandler(w http.ResponseWriter, r *http.Request) {
	tl, err := s.Service.GetAllTime_Logs(r.Context())
	if err != nil {
		http.Error(w, "Could not retrieve time logs: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	
	response := models.ResponseAPI{
		Status:  "success",
		Message: "Time logs retrieved successfully",
		Data:    tl,
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
// Im just ditch this, my bad

// func (s *APIServer) TimeLogsHandler(w http.ResponseWriter, r *http.Request) {
// 	var tl models.Time_Logs

// 	err := json.NewDecoder(r.Body).Decode(&tl)
// 	if err != nil {
// 		// fmt.Println("Can't decode JSON:", err)
// 		http.Error(w, "Something went wrong :(", http.StatusBadRequest)
// 		return
// 	}
	
// 	// fmt.Println("Got you JSON:", tL)

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusCreated)
	
// 	response := models.ResponseAPI{
// 		Status: "Cool",
// 		Message: "It works!",
// 		Data:   tl,
// 	}

// 	err = json.NewEncoder(w).Encode(response)
// 	if err != nil {
// 		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
// 		return
// 	}
	
// }
