package utils

import (
	"errors"
	"net/url"
	"reflect"
	t "serverGo/utils/types"
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

// this is access both by the client and server
var API_ENDPOINTS = map[string]t.EndpointsStruct{
	"getPlayer":   {Endpoint: "/ISteamUser/GetPlayerSummaries/v0002/", IsPrivate: true},
	"getFriends":  {Endpoint: "/ISteamUserStats/GetFriendList/v0001/", IsPrivate: true},
	"getOwnGames": {Endpoint: "/IPlayerService/GetOwnedGames/v0001/", IsPrivate: true},

	"getGameDetails": {Endpoint: "/api/appdetails", IsPrivate: false},
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

func ConstructEndpoint(end t.EndpointsStruct) (URL_Endpoint, error) {

	if reflect.ValueOf(end).IsZero() {
		return URL_Endpoint{}, errors.New("empty endpoint struct")
	}

	if EnvVars.API_KEY == "" || EnvVars.DOMAIN_NAME == "" {
		return makePublicEndpoint(end.Endpoint)
	}

	if end.IsPrivate && end.Endpoint != "" {
		u, err := getEndpoint(PRIVATE_API_URL, end.Endpoint)

		if err != nil {
			return URL_Endpoint{}, err
		}

		vals := u.Query()
		vals.Set("key", EnvVars.API_KEY)

		u.RawQuery = vals.Encode()

		return URL_Endpoint{URL: u}, nil
	}

	if end.Endpoint != "" {
		return makePublicEndpoint(end.Endpoint)
	}

	return URL_Endpoint{}, errors.New("invalid endpoint")

}

func getEndpoint(urlChain string, end string) (*url.URL, error) {
	u, err := url.Parse(urlChain + end)

	if err != nil {
		return nil, err
	}

	return u, nil

}

func makePublicEndpoint(endpoint string) (URL_Endpoint, error) {
	u, err := getEndpoint(PUBLIC_API_URL, endpoint)
	if err != nil {
		return URL_Endpoint{}, err
	}

	return URL_Endpoint{u}, nil
}
