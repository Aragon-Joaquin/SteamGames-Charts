package graph

import (
	"context"
	"io"
	"net/http"
)

type Resolver struct{}

func (r *Resolver) FetchAPI(ctx context.Context, idSearch string, end string, ResultsChan chan *ResChanType) {
	defer close(ResultsChan)

	// creating req
	req, err := http.NewRequestWithContext(ctx, "GET", end, nil)

	if err != nil {
		panic(err)
	}

	// making req
	response, err := http.DefaultClient.Do(req)

	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	// read body
	b, err := io.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}

	ResultsChan <- &ResChanType{
		BodyResponse: b,
		Reponse:      response,
	}
}

func ReadBody(body io.ReadCloser) {

}
