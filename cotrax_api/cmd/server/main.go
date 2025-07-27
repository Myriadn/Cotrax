package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Myriadn/Cotrax/internal/api"
	"github.com/Myriadn/Cotrax/internal/database"
	"github.com/Myriadn/Cotrax/internal/services"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

/*
 * Main function is placed on top
 * if you're not reading README.md first
 * please do so.
 */
func main() {
	// Load environment variables
	godotenv.Load()

	// just makin it variable
	port := os.Getenv("PORT")
	defaultPort := "7000" // it's a testing port
	
	addr := ":" + port

	// trying to connect to the database
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatal("Okay problem with database connection", err)
	}
	defer db.Close()

	// Instance
	service := &services.Services{
		DB: db,
	}

	server := &api.APIServer{
		Service: service,
	}

	// its just a simple router
	router := chi.NewRouter()
	// router.Post("/api/v1/log", api.TimeLogsHandler)
	router.Post("/api/v1/projects", server.CreateProjectHandler)
	router.Get("/api/v1/projects", server.GetAllProjectsHandler)
	router.Post("/api/v1/files", server.CreateFileHandler)
	router.Get("/api/v1/files", server.GetAllFilesHandler)
	router.Post("/api/v1/time_logs", server.CreateTimeLogHandler)
	router.Get("/api/v1/time_logs", server.GetAllTimeLogsHandler)

	if port == "" {
		port = defaultPort
		fmt.Println("You forgot to set the PORT, but still Running", defaultPort)
	}

	if port != "" {
		fmt.Println("Cotrax API is running! Running on port:", port)
	}

	error := http.ListenAndServe(addr, router)
	if error != nil {
		log.Fatal(error)
	}
	
}