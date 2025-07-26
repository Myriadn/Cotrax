package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Myriadn/Cotrax/internal/api"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

/*
 * Main function is placed on top
 */
func main() {
	godotenv.Load()
	defaultPort := "8080"

	port := os.Getenv("PORT")

	if port == "" {
		port = defaultPort
		fmt.Println("You forgot to set the PORT, but still Running", defaultPort)
	}

	addr := ":" + port

	router := chi.NewRouter()
	router.Get("/", api.RootHandler)
	router.Post("/api/v1/log", api.TestHandler)

	if port := os.Getenv("PORT"); port != "" {
		fmt.Println("Cotrax API is running! Running on port:", port)
	}

	error := http.ListenAndServe(addr, router)
	if error != nil {
		log.Fatal(error)
	}
}