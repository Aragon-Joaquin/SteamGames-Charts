package utils

import (
	"errors"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

const (
	key1_name = "STEAM_API_KEY"
	key2_name = "STEAM_DOMAIN_NAME"
)

var EnvVars *EnvVariables

type EnvVariables struct {
	API_KEY     string
	DOMAIN_NAME string
}

func ReadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		panic("Error loading .env file")
	}

	API_KEY := os.Getenv(key1_name)
	DOMAIN_NAME := os.Getenv(key2_name)

	if API_KEY == "" || DOMAIN_NAME == "" {
		panic("Please, create use your Api keys")
	}

	EnvVars = &EnvVariables{
		API_KEY:     API_KEY,
		DOMAIN_NAME: DOMAIN_NAME,
	}
}

const (
	API_URL = "http://api.steampowered.com"
)

var API_ENDPOINTS = map[string]string{
	//! needs key
	// "getPlayerData": "/ISteamUserStats/GetPlayerSummaries/v0002/",
	"getFriends": "/ISteamUserStats/GetFriendList/v0001/",
	"getStats":   "/ISteamUserStats/GetUserStatsForGame/v0002/",

	//! doesn't need key
	"getGameDetails": "/api/appdetails",
}

func MakePublicEndpoint(endpoint string) (string, error) {
	u, err := getEndpoint(endpoint)
	if err != nil {
		return "", err
	}

	return u.String(), nil
}

func MakePrivateEndpoint(endpoint string) (string, error) {
	if EnvVars.API_KEY == "" || EnvVars.DOMAIN_NAME == "" {
		return "", errors.New("enviroment variables not defined")
	}

	u, err := getEndpoint(endpoint)

	if err != nil {
		return "", err
	}

	vals := u.Query()
	vals.Set("key", EnvVars.API_KEY)

	u.RawQuery = vals.Encode()
	return u.String(), nil

}

func getEndpoint(end string) (*url.URL, error) {
	finalEnd := API_ENDPOINTS[end]

	if finalEnd == "" {
		return nil, errors.New("unknown api endpoint")
	}

	u, err := url.Parse(API_URL + finalEnd)

	if err != nil {
		return nil, err
	}

	return u, nil

}
