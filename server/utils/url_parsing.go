package utils

import (
	"errors"
	"net/url"
)

type URL_Endpoint struct {
	URL *url.URL
}

type QueriesStruct struct {
	Key string
	Val string
}

const (
	PRIVATE_API_URL = "https://api.steampowered.com"
	PUBLIC_API_URL  = "https://store.steampowered.com"
)

var API_ENDPOINTS = map[string]string{
	//! needs key
	"getPlayer":  "/ISteamUserStats/GetPlayerSummaries/v0002/",
	"getFriends": "/ISteamUserStats/GetFriendList/v0001/",
	"getStats":   "/ISteamUserStats/GetUserStatsForGame/v0002/",

	//! doesn't need key
	"getGameDetails": "/api/appdetails",
}

func (u *URL_Endpoint) AddQueries(query ...QueriesStruct) {

	q := u.URL.Query()
	for _, qs := range query {
		if qs.Key == "" || qs.Val == "" {
			continue
		}
		q.Set(qs.Key, qs.Val)
	}

	u.URL.RawQuery = q.Encode()
}

func MakePublicEndpoint(endpoint string) (URL_Endpoint, error) {
	u, err := getEndpoint(endpoint, PUBLIC_API_URL)
	if err != nil {
		return URL_Endpoint{}, err
	}

	return URL_Endpoint{u}, nil
}

func MakePrivateEndpoint(endpoint string) (URL_Endpoint, error) {
	if EnvVars.API_KEY == "" || EnvVars.DOMAIN_NAME == "" {
		return URL_Endpoint{}, errors.New("enviroment variables not defined")
	}

	u, err := getEndpoint(endpoint, PRIVATE_API_URL)

	if err != nil {
		return URL_Endpoint{}, err
	}

	vals := u.Query()
	vals.Set("key", EnvVars.API_KEY)

	u.RawQuery = vals.Encode()

	return URL_Endpoint{URL: u}, nil

}

func getEndpoint(end string, api_url string) (*url.URL, error) {
	finalEnd := API_ENDPOINTS[end]

	if finalEnd == "" {
		return nil, errors.New("unknown api endpoint")
	}

	u, err := url.Parse(api_url + finalEnd)

	if err != nil {
		return nil, err
	}

	return u, nil

}
