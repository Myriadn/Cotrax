package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Myriadn/Cotrax/internal/api"
	"github.com/Myriadn/Cotrax/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

/*
 * Main function is placed on top
 * BEFORE START THE SERVER, DON'T FORGET TO SET .ENV CONFIGURATION
 * if not that's okay, we will set it to default
 */
func main() {
	godotenv.Load()

	db, err := database.ConnectDB()
	if err != nil {
		log.Fatal("Okay problem with database connection", err)
	}

	port := os.Getenv("PORT")
	defaultPort := "8080"
	
	addr := ":" + port

	// its just a simple router
	router := chi.NewRouter()
	router.Get("/", api.RootHandler)
	router.Post("/api/v1/log", api.TimeLogsHandler)

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

	defer db.Close()
}