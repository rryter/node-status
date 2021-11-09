package main

import (
	"log"
	"lukso/downloader"
	"lukso/metrics"
	"lukso/runner"
	"lukso/settings"
	"lukso/shared"
	"lukso/validator"
	"lukso/webserver"
	"os"

	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
)

func init() {
	userHomeDir, errHome := os.UserHomeDir()
	if errHome != nil {
		panic("Can not get the UserHomeDir")
	}

	shared.LuksoHomeDir = userHomeDir + "/.lukso"
	shared.BinaryDir = shared.LuksoHomeDir + "/binaries/"
	shared.NetworkDir = shared.LuksoHomeDir + "/networks/"

	db, err := bolt.Open(shared.LuksoHomeDir+"/settings.db", 0640, nil)
	if err != nil {
		log.Fatal(err)
	}
	shared.SettingsDB = db

}

func main() {
	app := webserver.App{
		Router: mux.NewRouter(),
	}

	app.Router.Methods("GET").Path("/health").HandlerFunc(metrics.Health)

	app.Router.Methods("GET").Path("/vanguard/metrics").HandlerFunc(metrics.VanguardMetrics)
	app.Router.Methods("GET").Path("/validator/metrics").HandlerFunc(metrics.ValidatorMetrics)
	app.Router.Methods("GET").Path("/pandora/debug/metrics").HandlerFunc(metrics.PandoraMetrics)
	app.Router.Methods("GET").Path("/downloaded-versions").HandlerFunc(downloader.GetDownloadedVersions)
	app.Router.Methods("GET").Path("/available-versions").HandlerFunc(downloader.GetAvailableVersions)

	app.Router.Methods("POST").Path("/update-client").HandlerFunc(downloader.DownloadClient)
	app.Router.Methods("POST").Path("/start-clients").HandlerFunc(runner.StartClients)
	app.Router.Methods("POST").Path("/stop-clients").HandlerFunc(runner.StopClients)
	app.Router.Methods("POST").Path("/launchpad/generate-keys").HandlerFunc(validator.GenerateValidatorKeys)
	app.Router.Methods("POST").Path("/settings").HandlerFunc(settings.SaveSettingsEndpoint)
	app.Router.Methods("GET").Path("/settings").HandlerFunc(settings.GetSettingsEndpoint)

	app.Start()
}
