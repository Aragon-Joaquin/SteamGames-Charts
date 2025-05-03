package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

const (
	key1_name = "STEAM_API_KEY"
	key2_name = "STEAM_DOMAIN_NAME"
)

type EnvVariables struct {
	API_KEY     string
	DOMAIN_NAME string
}

func ReadEnv() *EnvVariables {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	API_KEY := os.Getenv(key1_name)
	DOMAIN_NAME := os.Getenv(key2_name)

	if API_KEY == "" || DOMAIN_NAME == "" {
		log.Fatalln("Please, create use your Api keys")
	}

	envVar := EnvVariables{
		API_KEY:     API_KEY,
		DOMAIN_NAME: DOMAIN_NAME,
	}

	return &envVar
}
