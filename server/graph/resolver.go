package graph

import (
	"context"
	"fmt"
	"net/http"
)

type Resolver struct {
	ResultsChan chan string
}

func (r *Resolver) FetchAPI(ctx context.Context, idSearch string, end string) {

	// creating req
	req, err := http.NewRequestWithContext(ctx, "GET", end, nil)

	if err != nil {
		r.ResultsChan <- err.Error()
		return
	}

	// making req
	response, err := http.DefaultClient.Do(req)

	if err != nil {
		r.ResultsChan <- err.Error()
		return
	}
	defer response.Body.Close()

	fmt.Println(response)
	r.ResultsChan <- string(rune(response.StatusCode))
}
