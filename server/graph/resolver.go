package graph

import (
	"context"
	"io"
	"net/http"
)

type Resolver struct {
	ResultsChan  chan *http.Response
	BodyResponse []byte
}

func (r *Resolver) FetchAPI(ctx context.Context, idSearch string, end string) {
	defer close(r.ResultsChan)

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
	r.BodyResponse = b

	r.ResultsChan <- response
}

func ReadBody(body io.ReadCloser) {

}
