package utils

import (
	"context"
	"errors"
	"io"
	"net/http"
)

type ResChanType struct {
	BodyResponse []byte
	Reponse      *http.Response
	Error        error
}

func makeResChanError(message string) *ResChanType {
	return &ResChanType{
		BodyResponse: nil,
		Reponse:      nil,
		Error:        errors.New(message),
	}
}

func FetchAPI(ctx context.Context, end string, ResultsChan chan *ResChanType) {
	// creating req
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, end, nil)

	if err != nil {
		ResultsChan <- makeResChanError(err.Error())
		return
	}

	// making req
	response, err := http.DefaultClient.Do(req)

	if err != nil {
		ResultsChan <- makeResChanError(err.Error())
		return
	}
	defer response.Body.Close()

	//! very, but extremely vague check error.
	if response.Header.Get("Content-Type") == "text/html" {
		ResultsChan <- makeResChanError("timed out from the steam api. slow down.")
		return
	}

	// read body
	b, err := io.ReadAll(response.Body)
	if err != nil {
		ResultsChan <- makeResChanError(err.Error())
		return
	}

	ResultsChan <- &ResChanType{
		BodyResponse: b,
		Reponse:      response,
		Error:        nil,
	}
}
