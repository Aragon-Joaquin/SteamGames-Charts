package utils

import (
	"context"
	"errors"
	t "serverGo/utils/types"
)

type URL_SubEndpoint struct {
	URL_Endpoint *URL_Endpoint
	ResChan      chan *ResChanType
}

// only server can query & resolve
var API_SUBENDPOINTS = map[string]t.EndpointsStruct{
	"VanityUrl":  {Endpoint: "/ISteamUser/ResolveVanityURL/v1/", IsPrivate: true, DomainName: t.API_STEAMPOWERED},
	"TotalUsers": {Endpoint: "/ISteamChartsService/GetGamesByConcurrentPlayers/v1/", IsPrivate: false, DomainName: t.API_STEAMPOWERED},
}

func MakeSubEndpoint(subEnd string, queries ...QueriesStruct) (URL_SubEndpoint, error) {
	getSubEnd, ok := API_SUBENDPOINTS[subEnd]

	if !ok {
		return URL_SubEndpoint{}, errors.New("subendpoint unreachable")
	}

	u, err := ConstructEndpoint(getSubEnd)

	if err != nil {
		return URL_SubEndpoint{}, err
	}

	u.AddQueries(queries...)

	return URL_SubEndpoint{
		URL_Endpoint: &u,
		ResChan:      make(chan *ResChanType),
	}, nil
}

func (r *URL_SubEndpoint) FetchSubEndpoint(ctx context.Context) {
	go func() {
		FetchAPI(ctx, r.URL_Endpoint.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()
}
