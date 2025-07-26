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

func TestHandler(w http.ResponseWriter, r *http.Request) {
	var req models.Time_Logs

	if json.NewDecoder(r.Body).Decode(&req) != nil {
		http.Error(w, " :( Error", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "ID: %d, FilesID: %d, StartTime: %s, EndTime: %s, DurationSeconds: %d, CreatedAt: %s",
		req.ID, req.FilesID, req.StartTime, req.EndTime, req.DurationSeconds, req.CreatedAt)

}
