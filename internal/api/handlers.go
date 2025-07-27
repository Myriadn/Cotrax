package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Myriadn/Cotrax/internal/models"
)

func RootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, welcome to the Cotrax API!")
}

func TimeLogsHandler(w http.ResponseWriter, r *http.Request) {
	var req models.Time_Logs
	
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		// fmt.Println("Can't decode JSON:", err)
		http.Error(w, "Something went wrong :(", http.StatusBadRequest)
		return
	}
	
	// fmt.Println("Got you JSON:", req)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	
	response := models.ResponseAPI{
		Status: "Cool",
		Message: "It works!",
		Data: req,
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
	
}
