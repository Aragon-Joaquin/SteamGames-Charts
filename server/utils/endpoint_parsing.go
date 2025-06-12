package utils

import (
	"errors"
	"net/url"
	t "serverGo/utils/types"
)

type URL_Endpoint struct {
	URL *url.URL
}

type QueriesStruct struct {
	Key string
	Val string
}

// this is access both by the client and server
var API_ENDPOINTS = map[t.Routes]t.EndpointsStruct{
	//privates
	t.GetPlayer:         {Endpoint: "/ISteamUser/GetPlayerSummaries/v0002/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},
	t.GetFriends:        {Endpoint: "/ISteamUserStats/GetFriendList/v0001/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},
	t.GetOwnGames:       {Endpoint: "/IPlayerService/GetOwnedGames/v0001/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},
	t.GetRecentlyPlayed: {Endpoint: "/IPlayerService/GetRecentlyPlayedGames/v0001/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},
	t.GetSchema:         {Endpoint: "/ISteamUserStats/GetSchemaForGame/v2/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},
	t.GetPlayerBans:     {Endpoint: "/ISteamUser/GetPlayerBans/v1/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},

	// publics
	t.GetAchievements: {Endpoint: "/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/", IsPrivate: false, DomainName: t.API_STEAMPOWERED},
	t.GetGameDetails:  {Endpoint: "/api/appdetails", IsPrivate: false, DomainName: t.STORE_STEAMPOWERED},

	//http ones
	t.VanityUrl:  {Endpoint: "/ISteamUser/ResolveVanityURL/v1/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},
	t.TotalUsers: {Endpoint: "/ISteamChartsService/GetGamesByConcurrentPslayers/v1/", IsPrivate: false, DomainName: t.API_STEAMPOWERED},
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

func ConstructEndpoint(endName t.Routes) (URL_Endpoint, error) {
	end, ok := API_ENDPOINTS[endName]

	if !ok {
		return URL_Endpoint{}, errors.New("empty endpoint struct")
	}

	if EnvVars.API_KEY == "" || EnvVars.DOMAIN_NAME == "" {
		return URL_Endpoint{}, errors.New("no environments variables set")
	}

	//! private
	if end.IsPrivate && end.Endpoint != "" {
		u, err := getEndpoint(end.DomainName.ApiUrl(), end.Endpoint)

		if err != nil {
			return URL_Endpoint{}, err
		}

		vals := u.Query()
		vals.Set("key", EnvVars.API_KEY)

		u.RawQuery = vals.Encode()

		return URL_Endpoint{URL: u}, nil
	}

	//! public
	if end.Endpoint != "" {
		u, err := getEndpoint(end.DomainName.ApiUrl(), end.Endpoint)
		if err != nil {
			return URL_Endpoint{}, err
		}

		return URL_Endpoint{u}, nil
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
