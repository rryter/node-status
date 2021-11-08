package runner

import (
	"fmt"
	"log"
	"lukso/shared"
	"net/http"
	"os/exec"
)

func StartClients(w http.ResponseWriter, r *http.Request) {
	fmt.Println("              ")
	fmt.Println("Starting Clients")
	fmt.Println("              ")

	network := "l15-staging"

	startVanguard("v0.5.1-develop", network)
	startOrchestrator("v0.5.4-develop", network)
	startPandora("v0.5.3-develop", network)
}

func StopClients(w http.ResponseWriter, r *http.Request) {
	command := exec.Command("lukso", "stop")

	if err := command.Start(); err != nil {
		log.Fatal(err)
	}
}

func StartBinary(client string, version string, args []string) {

	command := exec.Command(shared.BinaryDir+client+"/"+version+"/"+client, args...)

	if startError := command.Start(); startError != nil {
		log.Println("ERROR STARTING " + client + "@" + version)
		log.Fatal(startError)
	}

}