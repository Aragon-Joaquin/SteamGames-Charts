package utils

import (
	"context"
	t "serverGo/utils/types"
)

type URL_SubEndpoint struct {
	URL_Endpoint *URL_Endpoint
	ResChan      chan *ResChanType
}

// only server can query & resolve
var API_SUBENDPOINTS = map[string]t.EndpointsStruct{}

func MakeSubEndpoint(subEnd t.Routes, queries ...QueriesStruct) (URL_SubEndpoint, error) {
	u, err := ConstructEndpoint(subEnd)

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
